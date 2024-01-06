// takes a distance that is in meters and converts to miles
const convertToMiles = (meters) => {
    const meterToMileConversion = 0.0006213712
    return (meters * meterToMileConversion).toFixed(2)
}

module.exports = { convertToMiles }