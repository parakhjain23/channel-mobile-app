export function formatTime(timestamp) {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
  
    const formattedHours = (hours % 12) || 12; // Convert to 12-hour format
    const formattedMinutes = minutes.toString().padStart(2, '0'); // Add leading zero for single-digit minutes
    const period = hours >= 12 ? 'PM' : 'AM';
  
    return `${formattedHours}:${formattedMinutes} ${period}`;
  }