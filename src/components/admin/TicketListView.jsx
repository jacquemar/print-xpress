import React, { useState, useEffect } from "react";
import axios from "axios";
import Admin from "../../pages/admin/Admin";
import Pagination from "../Pagination";
import "flowbite";
import API_URL from "../../config";
import TicketDetails from "../TicketDetails";

function TicketListView() {
  const [ticketList, setTicketList] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    axios
      .get(`${API_URL}/ticket-list`)
      .then((response) => {
        setTicketList(response.data);

      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des tickets :", error);
      });
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const ticketPerPage = 6;
  const lastTicketIndex = currentPage * ticketPerPage;
  const firstTicketIndex = lastTicketIndex - ticketPerPage;
  const currentProduct = ticketList.slice(firstTicketIndex, lastTicketIndex);

  const totalTicket = ticketList.length;
  const totalPagePerTicket = Math.ceil(totalTicket / ticketPerPage);
  const [showModal, setShowModal] = useState(false);

  const deleteTicket = async (ticketId) => {
    try {
      const response = await axios.delete(`${API_URL}/ticket/${ticketId}`);
      console.log(response.data.message); // Message de succès ou d'erreur
      // Mettez à jour votre liste de produits après la suppression
      setTicketList((prevTicket) =>
        prevTicket.filter((ticket) => ticket._id !== ticketId)
      );
    } catch (error) {
      console.error("Erreur lors de la suppression du produit :", error);
    }
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleViewDetails = async (ticket) => {
    try {
      const response = await axios.get(`${API_URL}/ticket/${ticket._id}`);
      const ticketWithDetails = response.data;
      setSelectedTicket(ticketWithDetails);
    } catch (error) {
      console.error("Erreur lors de la récupération des détails du ticket :", error);
    }
  };

  const handleCloseDetails = () => {
    setSelectedTicket(null);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Confirmed":
        return (
          <span className="inline-flex items-center rounded bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
            <svg
              className="me-1 h-3 w-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 11.917 9.724 16.5 19 7.5"
              />
            </svg>
            Confirmé
          </span>
        );
      case "Cancelled":
        return (
          <span className="inline-flex items-center rounded bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-300">
            <svg
              className="me-1 h-3 w-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18 17.94 6M18 18 6.06 6"
              />
            </svg>
            Annulé
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            <svg
              className="me-1 h-3 w-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 7h6l2 4m-8-4v8m0-8V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v9h2m8 0H9m4 0h2m4 0h2v-4m0 0h-5m3.5 5.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm-10 0a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"
              />
            </svg>
            En cours
          </span>
        );
    }
  };

  return (
    <div>
      <Admin />
      <div className="p-30 mt-10 text-center">
        <div className="p-50% inline-block">
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
              <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="p-4">
                    <div className="flex items-center">
                      <input
                        id="checkbox-all-search"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-800"
                      ></input>
                      <label htmlFor="checkbox-all-search" className="sr-only">
                        checkbox
                      </label>
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3">
                    numéro de ticket
                  </th>
                  <th scope="col" className="px-12 py-3">
                    Status
                  </th>

                  <th scope="col" className="w-10 px-6 py-3">
                    Commune de livraison
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Methode de livraison
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Méthode de paiement
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Prix de livraison
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Prix total
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Numéro de téléphone
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Détails
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentProduct.map((ticket) => (
                  <tr
                    key={ticket._id}
                    className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
                  >
                    <td className="w-4 p-4">
                      <div className="flex items-center">
                        <input
                          id={`checkbox-table-search-${ticket._id}`}
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-800"
                        />
                        <label
                          htmlFor={`checkbox-table-search-${ticket._id}`}
                          className="sr-only"
                        >
                          checkbox
                        </label>
                      </div>
                    </td>
                    <td
                      scope="row"
                      className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                    >
                      {ticket.ticketNumber}
                    </td>
                    <td class="px-4 py-3">
                    <dd className="mt-1.5">{getStatusBadge(ticket.status)}</dd>                            </td>
                    
                    <td className="px-6 py-4 text-teal-900 font-bold">{ticket.selectedCommune}</td>
                    <td className="px-6 py-4">{ticket.selectedMethod}</td>
                    <td className="px-6 py-4">{ticket.deliveryMethod}</td>
                    <td className="px-6 py-4">{ticket.deliveryPrice}</td>
                    <td className="px-6 py-4">{ticket.totalPrice}</td>
                    <td className="px-6 py-4">{ticket.phoneNumber}</td>
                    <td className="px-6 py-4">{ticket.orderDate}</td>
                    <td className="px-6 py-4">
                       <button type="button" onClick={() => handleViewDetails(ticket)}class="py-2 px-3 flex items-center text-sm font-medium text-center text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
  <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
  <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" clipRule="evenodd" />
</svg>

                                        Voir Détails
                                    </button>
                    </td>
                    <td className="flex items-center px-6 py-4">
                      <a href="#" className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                      > Edit
                      </a>
                      <button
                        type="button"
                        onClick={() => deleteTicket(ticket._id)}
                        data-modal-target="popup-modal"
                        data-modal-toggle="popup-modal"
                        className="ms-3 font-medium text-red-600 hover:underline dark:text-red-500"
                      >
                        REMOVE
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination
              totalTicket={totalTicket}
              ticketPerPage={ticketPerPage}
              setCurrentPage={paginate}
              totalPagePerTicket={totalPagePerTicket}
              currentPage={currentPage}
            />
          </div>
        </div>
      </div>
      {selectedTicket && (
        <TicketDetails ticket={selectedTicket} onClose={handleCloseDetails} />
      )}
    </div>
  );
}

export default TicketListView;
