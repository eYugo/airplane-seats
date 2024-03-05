const API_URL = "http://localhost:3000/api/";

/**
 * A utility function for parsing the HTTP response.
 */
function getJson(httpResponsePromise) {
  // server API always return JSON, in case of error the format is the following { error: <message> }
  return new Promise((resolve, reject) => {
    httpResponsePromise
      .then((response) => {
        if (response.ok) {
          // the server always returns a JSON, even empty {}. Never null or non json, otherwise the method will fail
          response
            .json()
            .then((json) => resolve(json))
            .catch((err) => reject({ error: "Cannot parse server response" }));
        } else {
          // analyzing the cause of error
          response
            .json()
            .then((obj) => reject(obj)) // error msg in the response body
            .catch((err) => reject({ error: "Cannot parse server response" })); // something else
        }
      })
      .catch((err) => reject({ error: "Cannot communicate" })); // connection error
  });
}

const getReservations = async (userId) => {
  return getJson(fetch(API_URL + "reservations/id/" + userId)).then(
    (reservations) => {
      return reservations;
    }
  );
};

const getAllReservations = async () => {
  return getJson(fetch(API_URL + "reservations/all")).then((reservations) => {
    return reservations;
  });
};

/**
 * This function deletes a reservation from the back-end library.
 */
function deleteReservation(reservationId) {
  return getJson(
    fetch(API_URL + "reservations/" + reservationId, {
      method: "DELETE",
      credentials: "include",
    })
  );
}

/**
 * This funciton adds a new reservation in the back-end library.
 */
function addReservation(reservation) {
  return getJson(
    fetch(API_URL + "reservations/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(reservation),
    })
  );
}

const reservationsAPI = {
  getReservations,
  getAllReservations,
  deleteReservation,
  addReservation,
};
export default reservationsAPI;
