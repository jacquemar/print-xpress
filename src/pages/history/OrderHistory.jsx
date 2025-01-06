import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  resetTicketList,
  addTicketNumber,
} from "../../redux/slices/ticketSlice";
import logo from "../../assets/logo192.png";
import { Footer } from "../../components";
import TicketDetails from "../../components/TicketDetails";
const OrderHistory = () => {
  const dispatch = useDispatch();
  const ticketList = useSelector((state) => state.ticket.ticketList);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      if (ticketList && ticketList.length > 0) {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_APP_BASE_URL}/tickets-by-numbers?ticketList=${ticketList.join(",")}`
          );
          if (!response.ok) {
            throw new Error("Erreur lors de la récupération des tickets");
          }
          const tickets = await response.json();

          setFilteredTickets(tickets);
        } catch (error) {
          console.error("Erreur lors de la récupération des tickets:", error);
        }
      }
    };

    fetchTickets();
  }, [ticketList]);

  const handleResetTicketList = () => {
    dispatch(resetTicketList());
  };

  const fetchProductDetails = async (productId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/product/${productId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch product details for ID: ${productId}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching product details:", error);
      return null;
    }
  };

  const handleViewDetails = async (ticket) => {
    const updatedCartItems = await Promise.all(
      ticket.cartItems.map(async (item) => {
        const productDetails = await fetchProductDetails(item.productId);
        return { ...item, productDetails };
      })
    );

    const ticketWithProductDetails = {
      ...ticket,
      cartItems: updatedCartItems,
    };

    setSelectedTicket(ticketWithProductDetails);
  };

  const getStatusBadge = (ticket) => {
    // Définir les classes associées à chaque statut
    const STATUS_COLORS = {
      'Nouveau': 'bg-blue-100 text-blue-800',
      'Confirmé': 'bg-green-100 text-green-800',
      'Production': 'bg-yellow-100 text-yellow-800',
      'Livraison': 'bg-indigo-100 text-indigo-800',
      'Livré': 'bg-emerald-100 text-emerald-800',
      'Annulé': 'bg-red-100 text-red-800'
    };
  
    // Obtenez la couleur en fonction du statut
    const status = ticket.status || 'Nouveau'; // Utilisez "Nouveau" comme valeur par défaut
    const colorClasses = STATUS_COLORS[status];
  
    return (
      <span className={`inline-flex items-center rounded px-2.5 py-0.5 text-xs font-medium ${colorClasses}`}>
       
        {status}
      </span>
    );
  };
  

  const handleCloseDetails = () => {
    setSelectedTicket(null);
  };

  return (
    <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <div className="mx-auto max-w-5xl">
          <div className="gap-4 sm:flex sm:items-center sm:justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
              Mes commandes
            </h2>

            <div className="mt-6 gap-4 space-y-4 sm:mt-0 sm:flex sm:items-center sm:justify-end sm:space-y-0">
              <div>
                <label
                  htmlFor="order-type"
                  className="sr-only mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Sélectionner le type de commande
                </label>
                <select
                  id="order-type"
                  className="focus:border-primary-500 focus:ring-primary-500 dark:focus:border-primary-500 dark:focus:ring-primary-500 block w-full min-w-[8rem] rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400"
                >
                  <option selected>Toutes les commandes</option>
                  <option value="pre-order">Pré-commande</option>
                  <option value="transit">En transit</option>
                  <option value="confirmed">Confirmée</option>
                  <option value="cancelled">Annulée</option>
                </select>
              </div>

              <span className="inline-block text-gray-500 dark:text-gray-400">
                {" "}
                de{" "}
              </span>

              <div>
                <label
                  htmlFor="duration"
                  className="sr-only mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Sélectionner la durée
                </label>
                <select
                  id="duration"
                  className="focus:border-primary-500 focus:ring-primary-500 dark:focus:border-primary-500 dark:focus:ring-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400"
                >
                  <option selected>cette semaine</option>
                  <option value="this month">ce mois</option>
                  <option value="last 3 months">les 3 derniers mois</option>
                  <option value="last 6 months">les 6 derniers mois</option>
                  <option value="this year">cette année</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-6 flow-root sm:mt-8">
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredTickets.map((ticket) => (
                <div
                  key={ticket._id}
                  className="flex flex-wrap items-center gap-y-4 py-6"
                >
                  <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                    <dt className="text-base font-medium text-gray-500 dark:text-gray-400">
                      ID de commande:
                    </dt>
                    <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
                      <a href="#" className="hover:underline">
                        #{ticket.ticketNumber}
                      </a>
                    </dd>
                  </dl>

                  <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                    <dt className="text-base font-medium text-gray-500 dark:text-gray-400">
                      Date:
                    </dt>
                    <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
                      {ticket.orderDate}
                    </dd>
                  </dl>

                  <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                    <dt className="text-base font-medium text-gray-500 dark:text-gray-400">
                      Prix:
                    </dt>
                    <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
                      {ticket.totalPrice} XOF
                    </dd>
                  </dl>

                  <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                    <dt className="text-base font-medium text-gray-500 dark:text-gray-400">
                      Statut:
                    </dt>
                    <dd className="mt-1.5">{getStatusBadge(ticket)}</dd>
                  </dl>

                  <div className="grid w-full gap-4 sm:grid-cols-2 lg:flex lg:w-64 lg:items-center lg:justify-end">
                    <button
                      type="button"
                      className="hover:bg-primary-800 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 w-full rounded-lg bg-pxcolor px-3 py-2 text-sm font-medium text-white focus:outline-none focus:ring-4 lg:w-auto"
                    >
                      Commander à nouveau
                    </button>
                    <button
                      onClick={() => handleViewDetails(ticket)}
                      className="hover:text-primary-700 inline-flex w-full justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700 lg:w-auto"
                    >
                      Voir les détails
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <nav
            className="mt-6 flex items-center justify-center sm:mt-8"
            aria-label="Pagination"
          >
            {/* Ajoutez ici la pagination si nécessaire */}
          </nav>

          <div className="mt-6 flex justify-center">
            <button
              onClick={handleResetTicketList}
              className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300"
            >
              Effacer mon historique de commandes
            </button>
          </div>
        </div>
        <Footer />
      </div>
      {selectedTicket && (
        <TicketDetails ticket={selectedTicket} onClose={handleCloseDetails} />
      )}
    </section>
    
  );
};

export default OrderHistory;
