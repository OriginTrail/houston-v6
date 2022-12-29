import SuccessToastComponent from '../components/shared/toasts/SuccessToastComponent';
import LoadingToastIcon from '../components/shared/toasts/LoadingToastIcon';
import ErrorToastIcon from '../components/shared/toasts/ErrorToastIcon';
import SuccessToastIcon from '../components/shared/toasts/SuccessToastIcon';
import CloseToastComponent from '@/components/shared/toasts/CloseToastComponent';
import { networkErrors } from '@/utils/errorMessages';

const toastIcons = {
  loading: LoadingToastIcon,
  success: SuccessToastIcon,
  error: ErrorToastIcon,
  undefined: LoadingToastIcon,
};

// eslint-disable-next-line no-unused-vars
export const generateToast = (title, message, type, { id, timeout } = {}) => {
  return [
    {
      component: SuccessToastComponent,
      props: {
        title: title,
        message: networkErrors[message] ?? message,
      },
      listeners: {},
    },
    {
      id: id ? id : 'loadingToast',
      icon: toastIcons[type],
      hideProgressBar: false,
      timeout: type === 'loading' ? 0 : timeout ? timeout : 3000,
      pauseOnFocusLoss: false,
      pauseOnHover: true,
      closeOnClick: true,
      toastClassName: 'loading-toast',
      closeButton: type !== 'loading' ? CloseToastComponent : false,
    },
  ];
};
