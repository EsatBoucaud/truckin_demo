import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material';
import Stack from '@mui/material/Stack';
import VisitorsChartLegend from './VisitorsChartLegend';
import EChartsReactCore from 'echarts-for-react/lib/core';

interface LegendsProps {
  chartRef: React.RefObject<EChartsReactCore>;
}

export const legendsData = [
  {
    id: 1,
    type: 'Referrals',
    rate: '80%',
  },
  {
    id: 2,
    type: 'Broker boards',
    rate: '60%',
  },
  {
    id: 3,
    type: 'Direct',
    rate: '50%',
  },
];

const VisitorsChartLegends = ({ chartRef }: LegendsProps) => {
  const theme = useTheme();
  const [toggleColor, setToggleColor] = useState({
    referrals: true,
    social: true,
    direct: true,
  });

  useEffect(() => {
    const handleBodyClick = (e: MouseEvent) => {
      handleToggleLegend(e as unknown as React.MouseEvent, null);
    };
    document.body.addEventListener('click', handleBodyClick);
    return () => {
      document.body.removeEventListener('click', handleBodyClick);
    };
  }, []);

  const getActiveColor = (type: string) => {
    if (type === 'Referrals') {
      return theme.palette.primary.main;
    } else if (type === 'Broker boards') {
      return theme.palette.secondary.lighter;
    } else if (type === 'Direct') {
      return theme.palette.secondary.main;
    }
  };

  const getDisableColor = (type: string) => {
    if (type === 'Referrals') {
      return theme.palette.primary.dark;
    } else if (type === 'Broker boards') {
      return theme.palette.secondary.darker;
    } else if (type === 'Direct') {
      return theme.palette.secondary.dark;
    }
  };

  const handleToggleLegend = (e: React.MouseEvent, type: string | null) => {
    e.stopPropagation();
    const echartsInstance = chartRef.current?.getEchartsInstance();
    if (!echartsInstance) return;

    const option = echartsInstance.getOption() as echarts.EChartsOption;

    if (type === 'Referrals') {
      setToggleColor({ referrals: true, social: false, direct: false });
    } else if (type === 'Broker boards') {
      setToggleColor({ referrals: false, social: true, direct: false });
    } else if (type === 'Direct') {
      setToggleColor({ referrals: false, social: false, direct: true });
    } else {
      setToggleColor({ referrals: true, social: true, direct: true });
    }

    if (Array.isArray(option.series)) {
      const series = option.series.map((s) => {
        if (Array.isArray(s.data)) {
          s.data.forEach((item) => {
            if (type !== null && item.itemStyle && item.itemStyle.color) {
              if (type === item.type) {
                item.itemStyle.color = getActiveColor(item.type);
              } else {
                item.itemStyle.color = getDisableColor(item.type);
              }
            } else {
              item.itemStyle.color = getActiveColor(item.type);
            }
          });
        }
        return s;
      });

      echartsInstance.setOption({ series });
    }
  };

  return (
    <Stack mt={-1} spacing={3} direction="column">
      {legendsData.map((item) => (
        <VisitorsChartLegend
          key={item.id}
          data={item}
          toggleColor={toggleColor}
          handleToggleLegend={handleToggleLegend}
        />
      ))}
    </Stack>
  );
};

export default VisitorsChartLegends;
