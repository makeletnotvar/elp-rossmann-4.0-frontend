// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, TimeScale, Title, Tooltip } from 'chart.js';
// import 'chartjs-adapter-moment';
// import { useMeterPatternStyle } from 'modules/buildings/hooks/useMeterPatternStyle';
// import moment from 'moment';
// import React from 'react';
// import { Bar } from 'react-chartjs-2';
// import { GetMetersDTO } from 'types/buildings';
// import { MeterConsumption } from 'types/data';

// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, TimeScale);

// interface HeatmapValueBoxTooltipDailyChartProps {
//   meters: GetMetersDTO[];
//   metersConsumption: MeterConsumption;
//   newDate: string;
// }

// const HeatmapValueBoxTooltipDailyChart: React.FC<HeatmapValueBoxTooltipDailyChartProps> = ({
//   meters,
//   metersConsumption,
//   newDate,
// }) => {
//   const { getPatternStyle } = useMeterPatternStyle(meters);
//   const meterColor = getPatternStyle(metersConsumption.meter.uuid).color;

//   const chartData = {
//     datasets: [
//       {
//         label: metersConsumption.meter.name,
//         data: metersConsumption.data.map(([time, value]) => {
//           const momentTime = moment(time).format('YYYY-MM-DD HH:mm:SS');

//           return { x: momentTime, y: value };
//         }),
//         categoryPercentage: 0.95,
//         barPercentage: 0.95,
//         borderWidth: 1.5,
//         backgroundColor: meterColor + 'A1',
//         borderColor: meterColor,
//         borderRadius: [{ topLeft: 3, topRight: 3 }],
//         borderSkipped: false,
//       },
//     ],
//   };

//   const options: any = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         display: false,
//       },
//       tooltip: {
//         callbacks: {
//           label: (item: any) => `  ${item.dataset.label}: ${item.formattedValue} kWh`,
//           labelColor: (item: any) => ({
//             borderColor: item.dataset.backgroundColor,
//             backgroundColor: item.dataset.backgroundColor,
//             borderWidth: 3,
//             borderRadius: 4,
//           }),
//           labelTextColor: () => '#808080',
//         },
//         backgroundColor: '#eee',
//         titleColor: '#808080',
//       },
//     },
//     animation: {
//       duration: 0,
//     },
//     layout: {
//       padding: 0,
//     },
//     scales: {
//       x: {
//         type: 'time',
//         bounds: 'ticks',
//         min: moment(newDate).startOf('day').add(0, 'hours'),
//         max: moment(newDate).startOf('day').add(1, 'days').add(0, 'hours'),
//         time: {
//           unit: 'hour',
//           tooltipFormat: 'YYYY-MM-DD HH:mm',
//           displayFormats: {
//             minute: 'HH:mm',
//             hour: 'HH:mm',
//             day: 'YYYY-MM-DD',
//             week: 'YYYY-MM-DD',
//             month: 'YYYY-MM-DD',
//           },
//         },
//         beginAtZero: true,
//         grid: {
//           display: true,
//           color: 'rgba(0,0,0,0.03)',
//         },
//         ticks: {
//           color: '#bbb',
//           autoSkip: true,
//           maxRotation: 0,
//           minRotation: 0,
//           font: {
//             size: 10,
//           },
//         },
//       },
//       y: {
//         beginAtZero: true,
//         grid: {
//           display: true,
//           color: 'rgba(0,0,0,0.03)',
//         },
//         ticks: {
//           color: '#bbb',
//           font: {
//             size: 10,
//           },
//         },
//       },
//     },
//   };

//   return <Bar data={chartData} options={options} style={{ maxWidth: '100%' }} />;
// };

// export default HeatmapValueBoxTooltipDailyChart;
