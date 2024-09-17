export const getExpiryDate = (registrationDate, expiry) => {
    const date = new Date(registrationDate);
    let expiryText = '';
    
    const cleanedExpiry = expiry ? expiry.trim() : '';
  
    switch (cleanedExpiry) {
      case '3개월':
        date.setMonth(date.getMonth() + 3);
        expiryText = '3개월';
        break;
      case '6개월':
        date.setMonth(date.getMonth() + 6);
        expiryText = '6개월';
        break;
      case '7개월':
        date.setMonth(date.getMonth() + 7);
        expiryText = '7개월';
        break;
      case '1년':
        date.setFullYear(date.getFullYear() + 1);
        expiryText = '1년';
        break;
      default:
        return date.toLocaleDateString('en-CA');
    }
  
    return `${date.toLocaleDateString('en-CA')} (${expiryText})`;
  };
  