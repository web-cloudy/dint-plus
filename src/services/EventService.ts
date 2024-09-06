import http from "utils/http-common";

const getAllEventService = (reqBody: any) => {
  const {
    price,
    user_id,
    event_type,
    limit,
    offset,
    event_date,
    upcoming_events,
    search,
    latitude,
    longitude,
    max_distance_km,
  } = reqBody;
  return http({
    url: `api/events/list/?price=${price}&event_type=${event_type}&event_date=${event_date}&upcoming_events=${upcoming_events}&search=${search}&user_id=${user_id}&latitude=${latitude}&longitude=${longitude}&max_distance_km=${max_distance_km}`,
    type: "GET",
  });
};

const getVenueService = (venue: string) => {
  return http({ url: `api/venue/get/${venue}/`, type: "GET" });
};

const createEventService = (reqBody: any) => {
  return http({ url: `api/events/create/`, type: "POST", data: reqBody });
};

const getTicketIdByEventId = (id: string) => {
  return http({
    url: `api/tickets/get-ticket-id-by-event/${id}/`,
    type: "GET",
  });
};

const ticketSoldRequest = (reqBody: any) => {
  return http({ url: `api/ticket-sales/`, type: "POST", data: reqBody });
};

const eventTicketInfo = (id: string) => {
  return http({
    url: `api/tickets/get-ticket-sales-by-ticket-id/${id}/`,
    type: "GET",
  });
};

const generateQRcode = (reqBody: any) => {
  return http({
    url: `api/tickets/generate-qr-code-token/`,
    type: "POST",
    data: reqBody,
  });
};

const earningList = () => {
  return http({
    url: `api/events/get-all-events-of-user/`,
    type: "GET",
  });
};

const earningDetails = (year: string) => {
  return http({
    url: `api/events/get-earning-graph-details/?year=${year}`,
    type: "GET",
  });
};

const ticketsList = () => {
  return http({
    url: `api/tickets/get-users-tickets/`,
    type: "GET",
  });
};

const updateEventService = (reqBody: any) => {
  return http({
    url: `api/events/update/${reqBody?.id}/`,
    type: "PUT",
    data: reqBody?.data,
  });
};

const EventService = {
  getAllEventService,
  getVenueService,
  createEventService,
  getTicketIdByEventId,
  ticketSoldRequest,
  eventTicketInfo,
  generateQRcode,
  earningDetails,
  earningList,
  ticketsList,
  updateEventService,
};

export default EventService;
