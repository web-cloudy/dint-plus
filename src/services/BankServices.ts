import http from "utils/http-common";

const bankAccListService = () => {
  return http({
    url: `api/bank-accounts/`,
    type: "GET",
  });
};

const addBankAccount = (reqBody: any) => {
  return http({
    url: `api/bank-accounts/`,
    type: "POST",
    data: reqBody,
  });
};

const markAccAsDefault = (id: string) => {
  return http({
    url: `api/bank-accounts/mark-default/${id}/`,
    type: "PUT",
  });
};

const editBankAccount = (reqBody: any) => {
  return http({
    url: `api/bank-accounts/${reqBody?.id}/`,
    type: "PUT",
    data: reqBody?.data,
  });
};

const deleteBankAccount = (id: string) => {
  return http({
    url: `api/bank-accounts/${id}/`,
    type: "DELETE",
  });
};

const getUserWallet = () => {
  return http({
    url: `api/user/get-user-wallet/`,
    type: "GET",
  });
};

const addBalance = (reqBody: any) => {
  return http({
    url: `api/user/add-balance/`,
    type: "PUT",
    data: reqBody,
  });
};

const sendAmountToAnotherUser = (reqBody: any) => {
  return http({
    url: `api/user/send-amount-to-another-user/`,
    type: "POST",
    data: reqBody,
  });
};

const BankService = {
  bankAccListService,
  addBankAccount,
  markAccAsDefault,
  editBankAccount,
  deleteBankAccount,
  getUserWallet,
  addBalance,
  sendAmountToAnotherUser,
};

export default BankService;
