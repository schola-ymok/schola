import StarIcon from '@mui/icons-material/Star';
import { Box, LinearProgress, linearProgressClasses, Rating } from '@mui/material';
import { useRouter } from 'next/router';

import Consts from 'utils/Consts';

const RatingReportPanel = ({ text }) => {
  const router = useRouter();
  const PercentageBar = ({ rate, value }) => (
    <Box sx={{ display: 'flex', mb: 0.5 }}>
      <LinearProgress
        variant='determinate'
        sx={{
          flexShrink: 0,
          height: '12px',
          width: { xs: '60px', sm: '110px' },
          my: 'auto',
          [`&.${linearProgressClasses.colorPrimary}`]: {
            backgroundColor: '#cccccc',
          },
          [`& .${linearProgressClasses.bar}`]: {
            backgroundColor: '#888888',
          },
        }}
        value={value}
      />
      <Rating
        name='size-small'
        defaultValue={rate}
        size='small'
        readOnly
        sx={{ mx: 1, my: 'auto' }}
        emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize='inherit' />}
      />
      <Box
        sx={{
          fontSize: '0.8em',
          color: Consts.COLOR.Primary,
          '&:hover': {
            textDecoration: 'underline',
            color: Consts.COLOR.PrimaryDark,
            cursor: 'pointer',
          },
        }}
        onClick={() => {
          router.push(`/texts/${text.id}/reviews?rate=` + rate);
        }}
      >
        {value}%
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', width: 'fit-content' }}>
      <Box sx={{ width: '100px', display: 'flex' }}>
        <Box sx={{ m: 'auto' }}>
          <Box sx={{ display: 'flex' }}>
            <Box sx={{ fontSize: '2.0em', fontWeight: 'bold', color: '#b46a10', m: 'auto' }}>
              {text.rate}
            </Box>
          </Box>
          <Box sx={{ display: 'flex' }}>
            <Rating
              name='size-small'
              defaultValue={text.rate}
              size='small'
              readOnly
              precision={0.5}
              sx={{ mx: 'auto' }}
              emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize='inherit' />}
            />
          </Box>
        </Box>
      </Box>
      <Box sx={{ maxWidth: '230px', ml: 1 }}>
        <PercentageBar rate={5} value={text.rate_ratio_5} />
        <PercentageBar rate={4} value={text.rate_ratio_4} />
        <PercentageBar rate={3} value={text.rate_ratio_3} />
        <PercentageBar rate={2} value={text.rate_ratio_2} />
        <PercentageBar rate={1} value={text.rate_ratio_1} />
      </Box>
    </Box>
  );
};

export default RatingReportPanel;
