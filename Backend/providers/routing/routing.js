export class RoutingProvider {

    async getRoute(start, end) {
        throw new Error('RoutingProvider.getRoute() must be implemented');
    }

}