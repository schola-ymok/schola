import StarIcon from '@mui/icons-material/Star';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  Rating,
} from '@mui/material';
import router from 'next/router';
import { useState } from 'react';

import DefaultButton from 'components/DefaultButton';
import RTEditor from 'components/rteditor/RTEditor';
import Consts from 'utils/Consts';

import AdminApplicationListMenuButton from './AdminApplicationListMenuButton';

const AdminApplicationListItem = ({ text, handleClick, handleApprove, handleReject }) => {
  const [openApproveDialog, setOpenApproveDialog] = useState(false);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [dialogTextTitle, setDialogTextTitle] = useState();
  const [dialogTextId, setDialogTextId] = useState();

  return (
    <>
      <Box
        sx={{
          width: '100%',
          p: { xs: 0.4, sm: 1 },
          display: 'flex',
        }}
      >
        <Box fullWidth sx={{ width: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box
              sx={{ display: 'flex', flexFlow: 'column', width: '90%', cursor: 'pointer' }}
              onClick={handleClick}
            >
              <Box sx={{ display: 'flex' }}>
                <Box sx={{ fontWeight: 'bold', fontSize: '1.0em', my: 'auto' }}>
                  {text.title?.substring(0, 40)}
                  {text.title?.length > 40 && <>...</>}
                </Box>
              </Box>

              <Box sx={{ display: 'flex' }}></Box>
              <Box sx={{ fontSize: '0.8em', color: '#555555', display: 'flex' }}>
                更新日：{new Date(text.updated_at).toLocaleDateString('ja')}
              </Box>
            </Box>
            <Box>
              <Box sx={{ display: 'flex', flexFlow: 'column', height: '100%' }}>
                <AdminApplicationListMenuButton
                  handleApprove={() => {
                    setOpenApproveDialog(true);
                    setDialogTextId(text.id);
                    setDialogTextTitle(text.title);
                  }}
                  handleReject={() => {
                    setOpenRejectDialog(true);
                    setDialogTextId(text.id);
                    setDialogTextTitle(text.title);
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Divider />

      <ApproveConfirm
        open={openApproveDialog}
        title={dialogTextTitle}
        id={dialogTextId}
        handleOK={(id) => {
          handleApprove(id);
        }}
        handleClose={() => {
          setOpenApproveDialog(false);
        }}
      />
      <RejectDialog
        open={openRejectDialog}
        title={dialogTextTitle}
        id={dialogTextId}
        handleReject={(id, reasonText) => {
          handleReject(id, reasonText);
        }}
        handleClose={() => {
          setOpenRejectDialog(false);
        }}
      />
    </>
  );
};

const RejectDialog = ({ open, title, id, handleReject, handleClose }) => {
  const [reasonText, setReasonText] = useState();

  return (
    <>
      <Dialog fullWidth open={open} keepMounted onClose={handleClose}>
        <DialogTitle>
          <b>{title}</b>の差し戻し
        </DialogTitle>
        <DialogContent>
          <RTEditor
            placeholder='差し戻しの理由を入力してください'
            initialValue={reasonText}
            onChange={(value) => {
              setReasonText(value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <DefaultButton onClick={handleClose}>キャンセル</DefaultButton>
          <DefaultButton
            onClick={() => {
              handleReject(id, reasonText);
              handleClose();
            }}
          >
            差し戻し
          </DefaultButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

const ApproveConfirm = ({ open, title, id, handleOK, handleClose }) => (
  <>
    <Dialog open={open} keepMounted onClose={handleClose}>
      <DialogTitle>査読承認の確認</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <b>{title}</b> の販売を承認してよろしいですか？
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <DefaultButton onClick={handleClose}>いいえ</DefaultButton>
        <DefaultButton
          onClick={() => {
            handleOK(id);
            handleClose();
          }}
        >
          はい
        </DefaultButton>
      </DialogActions>
    </Dialog>
  </>
);

export default AdminApplicationListItem;
