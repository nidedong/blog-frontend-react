import MuiModal, { ModalProps } from '@mui/material/Modal';
import Paper, { PaperProps } from '@mui/material/Paper';
import React from 'react';
import Button, { ButtonProps } from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { isUndefined } from 'lodash-es';
import { useTranslation } from 'react-i18next';
import ClearIcon from '@mui/icons-material/Clear';
import ButtonBase from '@mui/material/ButtonBase';

const Modal: React.FC<
  ModalProps & {
    slotProps?: ModalProps['slotProps'] & {
      paper?: PaperProps;
      cancelButton?: ButtonProps;
      okButton?: ButtonProps;
    };

    footer?: React.ReactNode;
    title?: React.ReactNode;
    subTitle?: React.ReactNode;
  }
> = ({ children, footer, title, subTitle, ...props }) => {
  const { t } = useTranslation();

  return (
    <MuiModal {...props}>
      <Paper
        {...props.slotProps?.paper}
        sx={{
          height: '80%',
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          ...props.slotProps?.paper?.sx,
        }}
      >
        <Box sx={{ p: 2, pb: 1 }}>
          <Stack direction='row' justifyContent='space-between'>
            {<Typography variant='h4'>{title ?? ''}</Typography>}
            <ButtonBase
              onClick={(e) => props.onClose?.(e, 'backdropClick')}
              sx={(theme) => ({
                width: 40,
                height: 40,
                overflow: 'hidden',
                borderRadius: theme.vars?.shape.borderRadius,
                border: '1px solid transparent',
                '&:hover': {
                  backgroundImage: theme.vars?.overlays[3],
                  borderColor: theme.vars?.palette.divider,
                },
              })}
            >
              <ClearIcon />
            </ButtonBase>
          </Stack>
          {subTitle && <Typography variant='subtitle1'>{subTitle}</Typography>}
        </Box>
        <Box sx={{ flex: 1, overflow: 'auto' }}>{children}</Box>
        {isUndefined(footer) ? (
          <Stack
            sx={(theme) => ({ borderTop: `1px solid ${theme.vars?.palette.divider}`, p: 2 })}
            direction='row'
            gap={2}
          >
            <Button
              fullWidth
              size='small'
              variant='outlined'
              onClick={(e) => props.onClose?.(e, 'backdropClick')}
              {...props.slotProps?.cancelButton}
            >
              {t('action.cancel')}
            </Button>
            <Button fullWidth size='small' variant='contained' {...props.slotProps?.okButton}>
              {t('action.confirm')}
            </Button>
          </Stack>
        ) : (
          footer
        )}
      </Paper>
    </MuiModal>
  );
};

export default Modal;
