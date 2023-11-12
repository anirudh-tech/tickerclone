function generateOrderId(prefix,orderId){
    const uniqueId = `${prefix}_${orderId.toHexString()}`
    return uniqueId
}

module.exports = generateOrderId