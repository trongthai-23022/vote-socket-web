import React from 'react';
import { Bar } from 'react-chartjs-2';

interface VoteData {
  options: { option: string; votes: number }[];
}

const ChartComponent: React.FC<{ voteData: VoteData }> = ({ voteData }) => {
  const data = {
    labels: voteData.options.map(option => option.option),
    datasets: [
      {
        label: 'Votes',
        data: voteData.options.map(option => option.votes),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  return <Bar data={data} />;
};

export default ChartComponent;