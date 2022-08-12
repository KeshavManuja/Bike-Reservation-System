const moment = require("moment");
export const queryPath = (payload) => {
  const pathMaker = Object.keys(payload).map(function (key) {
    if (key === "page") return `page=${payload[key]}`;
    else if (key === "rating" && payload[key])
      return `avgRating=${payload[key]}`;
    else if ((key === "startDate" || key === "endDate") && payload[key])
      return `${key}=${moment(payload[key]).format("YYYY-MM-DD")}`;
    else if (payload[key]) return key + "=" + payload[key];
  });
  const path = pathMaker.filter((el) => el).join("&");
  return path;
};
