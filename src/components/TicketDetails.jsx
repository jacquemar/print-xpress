import React from "react";

const TicketDetails = ({ ticket, onClose }) => {
  if (!ticket) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-gray-600 bg-opacity-50">
        <div className="w-full max-w-4xl rounded-lg bg-white p-6 dark:bg-gray-800">
          <p className="text-center text-lg text-gray-900 dark:text-white">
            Aucune information détaillée n'est disponible pour ce ticket.
          </p>
          <button
            onClick={onClose}
            className="mt-4 w-full rounded-lg bg-pxcolor px-4 py-2 text-white hover:bg-blue-600"
          >
            Fermer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-gray-600 bg-opacity-50">
      <div className="w-full max-w-4xl rounded-lg bg-white p-6 dark:bg-gray-800">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Détails de la commande #{ticket.ticketNumber}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {ticket.cartItems && ticket.cartItems.length > 0 ? (
            ticket.cartItems.map((item, index) => (
              <div key={index} className="flex items-center space-x-4 py-4">
                {item && item.cover && (
                  <div className="h-14 w-14 flex-shrink-0">
                    <img
                      className="h-full w-full object-cover"
                      src={item.cover}
                      alt={item.name || "Product image"}
                    />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                    {item
                      ? item.name
                      : `Produit ID: ${item.productId}`}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Quantité: {item.quantity}
                  </p>
                  {item && item.price && (
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      Prix: {item.price * item.quantity} XOF
                    </p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="py-4 text-sm text-gray-500 dark:text-gray-400">
              Aucun produit dans cette commande.
            </p>
          )}

        </div>

        <div className="mt-6 space-y-2 border-t border-gray-200 pt-4 dark:border-gray-700">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Commune</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {ticket.selectedCommune}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">
              Méthode de livraison
            </span>
            <span className="font-medium text-gray-900 dark:text-white">
              {ticket.deliveryMethod}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">
              Prix de livraison
            </span>
            <span className="font-medium text-gray-900 dark:text-white">
              {ticket.deliveryPrice} XOF
            </span>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <span className="text-gray-900 dark:text-white">Total</span>
            <span className="text-gray-900 dark:text-white">
              {ticket.totalPrice} XOF
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">
              Numéro de téléphone
            </span>
            <span className="font-medium text-gray-900 dark:text-white">
              {ticket.phoneNumber}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">
              Date de commande
            </span>
            <span className="font-medium text-gray-900 dark:text-white">
              {ticket.orderDate}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;
