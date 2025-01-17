import TradeOfferManager from "steam-tradeoffer-manager";
import { getMainAccount } from "../store/access";
import SteamUser from "steam-user";

const tradeOfferManager = new TradeOfferManager({
    steam: new SteamUser()
});

export function getTradeOfferManager(): Promise<any> {
    return new Promise((resolve) => {
        tradeOfferManager.shutdown();
        tradeOfferManager.setCookies(getMainAccount()?.cookies || [], null, (err) => {

            // Null returned if their account is limited
            if (err) return resolve(null); 
            resolve(tradeOfferManager);
        });
    });
}

// TODO: Remove as we just have the user access their trades via proxy web window rather than showing them on app
export function getActiveIncomingOffers(): Promise<any[]> {
    return new Promise((resolve) => {
        getTradeOfferManager().then((manager) => {
            const ActiveOnly = 1;
            if (manager == null) return resolve([]);
            manager.getOffers(ActiveOnly, null, async (err, sent, received) => {
                if (err) return resolve([]);

                // Populate the offer details with image of items
                received = received.map((offer) => {
                    offer.itemsToGive = offer.itemsToGive.map(item => {
                        item.imageURL = item.getImageURL();
                        return item;
                    });
                    offer.itemsToReceive = offer.itemsToReceive.map(item => {
                        item.imageURL = item.getImageURL();
                        return item;
                    });
                    return offer;
                });
                return resolve(received);
            });
        });
    });
}

// TODO: Remove as we just have the user access their trades via proxy web window rather than showing them on app
export function acceptOffer(offerid: string): Promise<string> {
    return new Promise((resolve, reject) => {
        getTradeOfferManager().then((manager) => {
            if (manager == null) return reject("Aucune offre pour cet utilisateur sous cet ID d'offre");
            manager.getOffer(offerid, (err, offer) => {
                if (err) return reject(err);
                offer.accept(false, (err, status) => {
                    if (err) return reject(err);
                    resolve(status);
                });
            });
        });
    });
}

// TODO: Remove as we just have the user access their trades via proxy web window rather than showing them on app
export function declineOffer(offerid: string): Promise<void> {
    return new Promise((resolve, reject) => {
        getTradeOfferManager().then((manager) => {
            if (manager == null) return reject("Aucune offre pour cet utilisateur sous cet ID d'offre");

            manager.getOffer(offerid, (err, offer) => {
                if (err) return reject(err);
                offer.decline((err) => {
                    if (err) return reject(err);
                    resolve(null);
                });
            });
        });
    });
}