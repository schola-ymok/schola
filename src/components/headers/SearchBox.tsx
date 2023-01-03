import SearchIcon from '@mui/icons-material/Search';
import { Box, IconButton } from '@mui/material';
import InputBase from '@mui/material/InputBase';
import router, { useRouter } from 'next/router';
import { useState, useRef, useEffect } from 'react';
import useLocationChange from 'utils/useLocationChange';

import Consts from 'utils/Consts';

const SearchBox = ({ fullWidth }) => {
  const router = useRouter();
  const query = router.query.keyword === undefined ? '' : router.query.keyword;

  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef();

  const handleChangeRoute = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  useEffect(() => {
    router.events.on('routeChangeComplete', handleChangeRoute);
    return () => {
      router.events.off('routeChangeComplete', handleChangeRoute);
    };
  }, []);

  const handleSearch = () => {
    router.push(`search?keyword=${searchQuery}`);
  };

  const width = fullWidth ? '100%' : '260px';
  return (
    <Box
      sx={{
        border: '1px solid #aaaaaa',
        width: { width },
        '&:hover': {
          border: '2px solid #000000',
        },
      }}
    >
      <InputBase
        sx={{
          ml: 1,
          flex: 1,
          width: 'calc(100% - 50px)',
        }}
        id='query'
        inputRef={inputRef}
        placeholder='検索'
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.keyCode === 13) {
            handleSearch();
          }
        }}
      />
      <IconButton
        type='button'
        sx={{
          p: '7px',
          '&:hover': Consts.SX.IconButtonHover,
        }}
        aria-label='search'
        onClick={handleSearch}
      >
        <SearchIcon />
      </IconButton>
    </Box>
  );
};

export default SearchBox;
