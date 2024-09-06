import http from "utils/http-common";

const saveCardService = (reqBody: any) => {
  return http({
    url: `api/stripe/credit-card/`,
    type: "POST",
    data: reqBody,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const getServiceIntent = (reqBody: any) => {
  return http({
    url: `api/user/create-payment-intent/`,
    type: "POST",
    data: reqBody,
  });
};

const getSavedCardsList = () => {
  return http({
    url: `api/stripe/credit-card/`,
    type: "get",
  });
};

const makePaymentForSelectedCard = (data: any) => {
  return http({
    url: `api/stripe/credit-cards/${data?.id}/make-payment/`,
    type: "post",
    data: data?.params,
  });
};

const StripeService = {
  saveCardService,
  getServiceIntent,
  getSavedCardsList,
  makePaymentForSelectedCard,
};

export default StripeService;
