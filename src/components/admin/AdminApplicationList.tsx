import { Box, Pagination, Snackbar } from '@mui/material';
import { useRouter } from 'next/router';
import { useContext, useState, useEffect } from 'react';
import useSWR, { useSWRConfig } from 'swr';

import { approveAdminReviewApplication } from 'api/approveAdminReviewApplication';
import { getAdminReviewApplicationList } from 'api/getAdminReviewApplicationList';
import { rejectAdminReviewApplication } from 'api/rejectAdminReviewApplication';
import CenterLoadingSpinner from 'components/CenterLoadingSpinner';
import LoadingBackDrop from 'components/LoadingBackDrop';
import { AuthContext } from 'components/auth/AuthContext';
import { pagenation } from 'utils/pagenation';

import AdminApplicationListItem from './AdminApplicationListItem';

const AdminApplcationList = () => {
  const router = useRouter();

  const page = router.query.page ?? 1;
  const { authAxios } = useContext(AuthContext);

  const { mutate } = useSWRConfig();
  const { data, error } = useSWR(
    `/admin/applications?page=${page}`,
    () => getAdminReviewApplicationList(authAxios, page - 1),
    {
      revalidateOnFocus: false,
    },
  );

  const [snack, setSnack] = useState({ open: false, message: '' });

  const [loading, setLoading] = useState(false);

  if (error) return <h1>error</h1>;

  const handleApprove = async (id) => {
    setLoading(true);

    const { error } = await approveAdminReviewApplication(authAxios, id);
    if (error) {
      console.log(error);
      return;
    }

    setSnack({ open: true, message: '承認しました' });
    mutate(`/admin/applications?page=${page}`);
  };

  const handleReject = async (id, reasonText) => {
    setLoading(true);

    const { error } = await rejectAdminReviewApplication(authAxios, id, reasonText);
    if (error) {
      console.log(error);
      return;
    }

    setSnack({ open: true, message: '差し戻しました' });
    mutate(`/admin/applications?page=${page}`);
  };

  useEffect(() => {
    if (data) {
      setLoading(false);
    }
  }, [data]);

  const DataContent = ({ data }) => {
    if (!data) return <CenterLoadingSpinner />;

    const { count, from, to } = pagenation(data.total, page, data.texts.length);

    return (
      <>
        <Box>
          {data.total}件 （{from} - {to} を表示）
        </Box>
        {data.texts.map((item) => {
          return (
            <AdminApplicationListItem
              text={item}
              handleView={() => {}}
              handleApprove={handleApprove}
              handleReject={handleReject}
            />
          );
        })}
        {count > 1 && (
          <Pagination
            sx={{ mt: 2 }}
            count={count}
            color='primary'
            onChange={(e, page) => router.push(`/dashboard/?page=${page}`)}
            page={+page}
          />
        )}
      </>
    );
  };

  return (
    <Box sx={{ display: 'flex', flexFlow: 'column', width: '100%' }}>
      {loading && <LoadingBackDrop />}
      <Box>
        <Box sx={{ fontSize: '1.2em', fontWeight: 'bold', mb: 1 }}>査読申請一覧</Box>
        <DataContent data={data} />
      </Box>
      <Snackbar
        open={snack.open}
        message={snack.message}
        autoHideDuration={1000}
        onClose={() => setSnack({ open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};

export default AdminApplcationList;
