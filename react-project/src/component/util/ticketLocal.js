// util/ticketLocal.js

export const fetchTicketsFromLocalStorage = (setTickets) => {
  try {
    const localTickets = localStorage.getItem('tickets');
    if (localTickets) {
      const parsedTickets = JSON.parse(localTickets);
      //console.log('Local storage tickets:', parsedTickets);

      const formattedTickets = parsedTickets.map(ticket => {
        const registrationDate = new Date(ticket.registrationDate).toISOString().split('T')[0];
        return {
          ...ticket,
          registrationDate: registrationDate,
          expiry: ticket.expire
        };
      });

      setTickets(formattedTickets);
    } else {
      setTickets([]);
    }
  } catch (error) {
    console.error('Failed to fetch tickets from local storage:', error);
    setTickets([]);
  }
};
