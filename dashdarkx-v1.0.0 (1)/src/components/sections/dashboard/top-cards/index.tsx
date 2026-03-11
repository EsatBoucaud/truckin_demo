import Grid from '@mui/material/Grid';
import TopCard from './TopCard';

const cardsData = [
  {
    id: 1,
    title: 'Active loads',
    value: '128',
    rate: '+8.4%',
    isUp: true,
    icon: 'mingcute:road-fill',
  },
  {
    id: 2,
    title: 'Available trucks',
    value: '24',
    rate: '+3.2%',
    isUp: true,
    icon: 'mdi:truck',
  },
  {
    id: 3,
    title: 'On-time rate',
    value: '96.2%',
    rate: '-1.1%',
    isUp: false,
    icon: 'mingcute:check-circle-fill',
  },
  {
    id: 4,
    title: 'Weekly revenue',
    value: '$84.3K',
    rate: '+5.7%',
    isUp: true,
    icon: 'mingcute:currency-dollar-2-line',
  },
];

const TopCards = () => {
  return (
    <Grid container spacing={{ xs: 2.5, sm: 3, lg: 3.75 }}>
      {cardsData.map((item) => {
        return (
          <TopCard
            key={item.id}
            title={item.title}
            value={item.value}
            rate={item.rate}
            isUp={item.isUp}
            icon={item.icon}
          />
        );
      })}
    </Grid>
  );
};

export default TopCards;
