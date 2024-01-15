import React, { useEffect, useState } from 'react'

import {

  CCol,
  CProgress,
  CRow,
  CDropdown,
  CWidgetStatsA,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CCard,
  CCardBody,


} from '@coreui/react'
import billService from '../service/bill-service'
import { CChartLine } from '@coreui/react-chartjs'
import CIcon from '@coreui/icons-react'
import { cilList, cilShieldAlt, cilArrowTop, cilOptions } from '@coreui/icons';
import ReactApexChart from 'react-apexcharts';
const Dashboard = () => {
  const [chartData, setChartData] = useState({
    series: [{
      name: "Doanh thu",
      data: [] // Dữ liệu ban đầu trống
    }],
    options: {
      chart: {
        height: 350,
        type: 'line'
      },
      xaxis: {
        categories: [] // Categories ban đầu trống
      },
      title: {
        text: 'Doanh thu các ngày trong tháng ',
      },
    }
  });


  const [chartDataCount, setChartDataCount] = useState({
    series: [],
    options: {
      chart: {
        type: 'bar',
        height: 350,
        stacked: true
      },
      title: {
        text: 'Số lượng đơn hàng hủy và thành công',
      },
      xaxis: {
        categories: []
      },
      // Các cấu hình khác nếu bạn cần
    }
  });

  const [countStatus, setCountStatus] = useState({})

  const getDaysInMonth = (year, month) => {
    return new Date(year, month, 0).getDate();
  };

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1; // Trả về giá trị từ 1-12
  const daysInMonth = Math.min(getDaysInMonth(currentYear, currentMonth), 30);

  const categories = Array.from({ length: daysInMonth }, (_, i) => `${i + 1}/${currentMonth}/${currentYear}`);


  const processChartData = (apiData) => {
    const huyCounts = new Array(daysInMonth).fill(0);
    const khachDaNhanHangCounts = new Array(daysInMonth).fill(0);

    apiData.forEach(item => {
      const date = new Date(item.date);
      const dayOfMonth = date.getDate(); // Lấy ngày trong tháng
      if (date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear) {
        huyCounts[dayOfMonth - 1] = item.huyCount;
        khachDaNhanHangCounts[dayOfMonth - 1] = item.khachDaNhanHangCount;
      }
    });

    return { huyCounts, khachDaNhanHangCounts };
  };

  const getCountDay = () => {
    billService.countDay()
      .then(res => {
        const { huyCounts, khachDaNhanHangCounts } = processChartData(res.data);

        setChartDataCount({
          series: [
            { name: 'Hủy', data: huyCounts },
            { name: 'Khách Đã Nhận Hàng', data: khachDaNhanHangCounts }
          ],
          options: {
            ...chartData.options,
            xaxis: { categories },
            colors: ['#cecfcf', '#008FFB'] // 'red' cho 'Hủy', màu xanh cho 'Khách Đã Nhận Hàng'
          }
        });
      })
      .catch(err => {
        console.error("Error fetching data: ", err);
      });
  };

  useEffect(() => {
    getCountDay();
    
  }, []);
  // Hàm để lấy dữ liệu từ API và cập nhật biểu đồ
  const getDoanhThuDay = () => {
    billService.doanhThuDay()
      .then(res => {
        console.log("doanh thu day", res.data);
        // Giả sử res.data là mảng dữ liệu từ API
        const newCategories = res.data.map(item => item.date);
        const newData = res.data.map(item => item.totalRevenue);

        setChartData(prevChartData => ({
          ...prevChartData,
          series: [{ name: "Doanh thu", data: newData }],
          options: {
            ...prevChartData.options,
            xaxis: { categories: newCategories }
          }
        }));
      })
      .catch(err => {
        console.error("Error fetching data: ", err);
      });
  };

  const getCountStatus = () => {
    billService.getCountStatus()
      .then(res => {
        setCountStatus(res.data.data[0])

      }).catch(err => {
        console.log(err);
      })
  }

  // Gọi API khi component được mount
  useEffect(() => {
    getDoanhThuDay();
    getCountDay();
    getCountStatus();
  }, []);




  return (
    <>
      <CRow>
        <CCol sm={2}>
          <CWidgetStatsA
            className="mb-4"
            color='warning'
            value={
              <>
                {countStatus.chuaXacNhan}{' '}
                <span className="fs-6 fw-normal">
                  (40.9% <CIcon icon={cilArrowTop} />)
                </span>
              </>
            }
            title="Chưa xác nhận"

            chart={
              <CChartLine
                className="mt-3 mx-3"
                style={{ height: '70px' }}
                data={{
                  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                  datasets: [
                    {
                      label: 'My First dataset',
                      backgroundColor: 'transparent',
                      borderColor: 'rgba(255,255,255,.55)',
                      pointBackgroundColor: '#321fdb',
                      data: [65, 59, 84, 84, 51, 55, 40],
                    },
                  ],
                }}
                options={{
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      grid: {
                        display: false,
                        drawBorder: false,
                      },
                      ticks: {
                        display: false,
                      },
                    },
                    y: {
                      min: 30,
                      max: 89,
                      display: false,
                      grid: {
                        display: false,
                      },
                      ticks: {
                        display: false,
                      },
                    },
                  },
                  elements: {
                    line: {
                      borderWidth: 1,
                      tension: 0.4,
                    },
                    point: {
                      radius: 4,
                      hitRadius: 10,
                      hoverRadius: 4,
                    },
                  },
                }}
              />
            }
          />
        </CCol>

        <CCol sm={3}>
          <CWidgetStatsA
            className="mb-4"
            color='primary'
            value={
              <>
                {countStatus.daXacNhanVaDongGoi}{' '}
                <span className="fs-6 fw-normal">
                  (40.9% <CIcon icon={cilArrowTop} />)
                </span>
              </>
            }
            title="Đã xác nhận và đóng gói"

            chart={
              <CChartLine
                className="mt-3 mx-3"
                style={{ height: '70px' }}
                data={{
                  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                  datasets: [
                    {
                      label: 'My First dataset',
                      backgroundColor: 'transparent',
                      borderColor: 'rgba(255,255,255,.55)',
                      pointBackgroundColor: '#321fdb',
                      data: [65, 59, 84, 84, 51, 55, 40],
                    },
                  ],
                }}
                options={{
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      grid: {
                        display: false,
                        drawBorder: false,
                      },
                      ticks: {
                        display: false,
                      },
                    },
                    y: {
                      min: 30,
                      max: 89,
                      display: false,
                      grid: {
                        display: false,
                      },
                      ticks: {
                        display: false,
                      },
                    },
                  },
                  elements: {
                    line: {
                      borderWidth: 1,
                      tension: 0.4,
                    },
                    point: {
                      radius: 4,
                      hitRadius: 10,
                      hoverRadius: 4,
                    },
                  },
                }}
              />
            }
          />
        </CCol>
        <CCol sm={3}>
          <CWidgetStatsA
            className="mb-4"
            style={{
              backgroundColor: "#92b9e4", color: "white",
            }}

            value={
              <>
                {countStatus.daGiaoBenVanChuyen}{' '}
                <span className="fs-6 fw-normal">
                  (40.9% <CIcon icon={cilArrowTop} />)
                </span>
              </>
            }
            title="Đã giao bên vận chuyển"

            chart={
              <CChartLine
                className="mt-3 mx-3"
                style={{ height: '70px' }}
                data={{
                  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                  datasets: [
                    {
                      label: 'My First dataset',
                      backgroundColor: 'transparent',
                      borderColor: 'rgba(255,255,255,.55)',
                      pointBackgroundColor: '#39f',
                      data: [1, 18, 9, 17, 34, 22, 11],
                    },
                  ],
                }}
                options={{
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      grid: {
                        display: false,
                        drawBorder: false,
                      },
                      ticks: {
                        display: false,
                      },
                    },
                    y: {
                      min: -9,
                      max: 39,
                      display: false,
                      grid: {
                        display: false,
                      },
                      ticks: {
                        display: false,
                      },
                    },
                  },
                  elements: {
                    line: {
                      borderWidth: 1,
                    },
                    point: {
                      radius: 4,
                      hitRadius: 10,
                      hoverRadius: 4,
                    },
                  },
                }}
              />
            }
          />
        </CCol>
        <CCol sm={2}>
          <CWidgetStatsA
            className="mb-4"
            color='success'

            value={
              <>
                 {countStatus.khachDaNhanHang}{' '}
                <span className="fs-6 fw-normal">
                  (40.9% <CIcon icon={cilArrowTop} />)
                </span>
              </>
            }
            title="Khách đã nhận hàng"

            chart={
              <CChartLine
                className="mt-3"
                style={{ height: '70px' }}
                data={{
                  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                  datasets: [
                    {
                      label: 'My First dataset',
                      backgroundColor: 'rgba(255,255,255,.2)',
                      borderColor: 'rgba(255,255,255,.55)',
                      data: [78, 81, 80, 85, 88, 90, 92],
                      fill: true,
                    },
                  ],
                }}
                options={{
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      display: false,
                    },
                    y: {
                      display: false,
                    },
                  },
                  elements: {
                    line: {
                      borderWidth: 2,
                      tension: 0.4,
                    },
                    point: {
                      radius: 0,
                      hitRadius: 10,
                      hoverRadius: 4,
                    },
                  },
                }}
              />
            }
          />
        </CCol>
        <CCol sm={2}>
          <CWidgetStatsA
            className="mb-4"
            color='danger'
            value={
              <>
                 {countStatus.huy}{' '}
                <span className="fs-6 fw-normal">
                  (40.9% <CIcon icon={cilArrowTop} />)
                </span>
              </>
            }
            title="Hủy"


            chart={
              <CChartLine
                className="mt-3"
                style={{ height: '70px' }}
                data={{
                  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                  datasets: [
                    {
                      label: 'My First dataset',
                      backgroundColor: 'rgba(255,255,255,.2)',
                      borderColor: 'rgba(255,255,255,.55)',
                      data: [78, 81, 80, 45, 34, 12, 40],
                      fill: true,
                    },
                  ],
                }}
                options={{
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      display: false,
                    },
                    y: {
                      display: false,
                    },
                  },
                  elements: {
                    line: {
                      borderWidth: 2,
                      tension: 0.4,
                    },
                    point: {
                      radius: 0,
                      hitRadius: 10,
                      hoverRadius: 4,
                    },
                  },
                }}
              />
            }
          />
        </CCol>
      </CRow>

      <CCard className='mb-3'>
        <CCardBody>
          <ReactApexChart
            options={chartData.options}
            series={chartData.series}
            type="line"
            height={350}
          />
        </CCardBody>
      </CCard>
      <CCard>
        <CCardBody>
          <ReactApexChart
            options={chartDataCount.options}
            series={chartDataCount.series}
            type="bar"
            height={350}
          />
        </CCardBody>
      </CCard>
    </>
  )
}
export default Dashboard
