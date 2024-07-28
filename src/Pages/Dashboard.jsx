import React, { useEffect, useRef, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import Chart from 'chart.js/auto';

const Dashboard = () => {
  const barChartRef = useRef(null);
  const [barData, setBarData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Uploaded Vacancies',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  });

  const [schoolData, setSchoolData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Schools Registered Each Month',
        data: [],
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    const fetchVacancyData = async () => {
      try {
        const response = await axios.get('/api/vacancies/yearly'); // Replace with your API endpoint
        const data = response.data; // Assuming the data is in the format [{ year: '2024', count: 65 }, ...]

        // Extract labels and data
        const labels = data.map(item => item.year);
        const dataValues = data.map(item => item.count);

        setBarData({
          labels: labels,
          datasets: [
            {
              label: 'Uploaded Vacancies',
              data: dataValues,
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching vacancy data:', error);
      }
    };

    const fetchSchoolData = async () => {
      try {
        const response = await axios.get('/api/schools/monthly'); // Replace with your API endpoint
        const data = response.data; // Assuming the data is in the format [{ month: '2024-01', count: 15 }, ...]

        // Extract labels and data
        const labels = data.map(item => item.month);
        const dataValues = data.map(item => item.count);

        setSchoolData({
          labels: labels,
          datasets: [
            {
              label: 'Schools Registered Each Month',
              data: dataValues,
              backgroundColor: 'rgba(153, 102, 255, 0.6)',
              borderColor: 'rgba(153, 102, 255, 1)',
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching school data:', error);
      }
    };

    fetchVacancyData();
    fetchSchoolData();
  }, []);

  return (
    <div className='flex flex-col'>
      <div className="p-4 mb-4">
        <h2 className="text-xl font-semibold mb-4">Vacancies Posted Each Year</h2>
        <Bar ref={barChartRef} data={barData} />
      </div>
      <div className="p-4 mb-4">
        <h2 className="text-xl font-semibold mb-4">Schools Registered Each Month</h2>
        <Bar ref={barChartRef} data={schoolData} />
      </div>
    </div>
  );
};

export default Dashboard;
