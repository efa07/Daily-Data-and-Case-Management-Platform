import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';

const StockChart = () => {
    const [datasets, setDatasets] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('your-api-endpoint');
                const result = await response.json();

                if (!Array.isArray(result.data)) {
                    throw new Error("Data is not an array");
                }

                const chartData = result.data.map(item => ({
                    x: new Date(item.date),
                    y: parseFloat(item.value)
                }));

                setDatasets(chartData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const data = {
        datasets: [
            {
                label: 'Crude Oil Prices WTI',
                data: datasets,
                fill: false,
                borderColor: 'rgba(75,192,192,1)',
                tension: 0.1
            }
        ]
    };

    return <Line data={data} />;
};

export default StockChart;
