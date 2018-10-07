export default {
    findClosestAddress: (address) => {
        if (!address.city) {
            switch (address.countryCode) {
                case 'ES':
                    return 'Canary Island, Spain'
                default:
                    return address.countryCode
            }
        } else {
            return `${address.city}, ${address.stateCode}`
        }
    }
}