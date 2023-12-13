const convertToMiles = (meters) => {
    const meterToMileConversion = 0.0006213712
    return Math.round(meters * meterToMileConversion)
}

module.exports = { convertToMiles }