import { useWeb3 } from "@3rdweb/hooks";
import { useCallback, useMemo, useEffect, useState } from "react";
import { ThirdwebSDK } from "@3rdweb/sdk";
import { ethers } from "ethers";
import React from "react";

const AuctionComponent = () => {
  const { provider } = useWeb3();
  //const [balance, setBalance] = useState([]);

  // We won't always have a provider, and so we need to be sure to
  // instantiate the ThirdwebSDK with a provider *only if we have one*
  const sdk = useMemo(
    () =>
      provider ? new ThirdwebSDK(provider.getSigner()) : new ThirdwebSDK(),
    [provider]
  );
  // const sdk = useMemo(() => {

  // We should use the `useMemo` to ensure that the `market` is always
  // initiated with the latest `sdk` variable
  const market = useMemo(
    () =>
      sdk.getMarketplaceModule("0xCb67A96FAd36D8c24f192B9eDaD5fF3c7A7A867f"),
    [sdk]
  );

  // Declaring the nft smart contract address
  const nftSmartContractAddress = "0x95c78aca2c99df3E7469769C56565ECc0e8eCe95";
  const currencySmartContractAddress =
    "0x0d5fb8942eEa62093944F3e91C6Ac4e584336741";

  const [tokenId, setTokenId] = React.useState("");
  const [tokenIdOffer, setTokenIdOffer] = React.useState("");

  function AuctionListingTokenId(event) {
    setTokenId(event.target.value);
  }
  function AuctionListingTokenIdOffer(event) {
    setTokenIdOffer(event.target.value);
  }
  function SubmitAuctionListing(event) {
    event.preventDefault();
    createAuctionListing();
  }

  const [listId, setListId] = React.useState("");
  const [listIdBid, setListIdOffer] = React.useState("");

  function AuctionListingListId(event) {
    setListId(event.target.value);
  }
  function AuctionListingListIdQuantity(event) {
    setListIdOffer(event.target.value);
  }
  function SubmitAuctionListingOffer(event) {
    event.preventDefault();
    makeBid();
  }

  //setting the minimum bid as 100th of the buyout price
  const tokenIdReserve = tokenIdOffer / 1000;
  const tokenIdReservePrice = tokenIdReserve.toString();

  // We should use the `useCallback` to ensure that the `buy`
  // function is always initiated with the latest `market` variable

  const createAuctionListing = useCallback(async () => {
    await market.createAuctionListing({
      assetContractAddress: nftSmartContractAddress,
      buyoutPricePerToken: ethers.utils.parseUnits(tokenIdOffer, 18),
      currencyContractAddress: currencySmartContractAddress,
      startTimeInSeconds: Math.floor(Date.now() / 1000),
      listingDurationInSeconds: 60 * 2,
      tokenId: tokenId,
      quantity: 1,
      reservePricePerToken: ethers.utils.parseUnits(tokenIdReservePrice, 18),
    });
  }, [market, tokenId, tokenIdOffer, tokenIdReservePrice]);

  const makeBid = useCallback(
    async (listingId) => {
      await market.makeAuctionListingBid({
        listingId: listId,
        pricePerToken: ethers.utils.parseUnits(listIdBid, 18),
      });
    },
    [listId, listIdBid, market]
  );

  return (
    <div>
      <form onSubmit={SubmitAuctionListing}>
        <input
          type="text"
          placeholder="enter token ID to list AUCTION"
          onChange={AuctionListingTokenId}
          style={{
            padding: "10px 20px",
            textAlign: "center",
            border: "2px solid white",
            borderRadius: "4px",
            backgroundColor: "grey",
            color: "white",
            width: "30%",
          }}
        />

        <input
          type="text"
          placeholder="enter price for buyout listing AUCTION"
          onChange={AuctionListingTokenIdOffer}
          style={{
            padding: "10px 20px",
            textAlign: "center",
            border: "2px solid white",
            borderRadius: "4px",
            backgroundColor: "grey",
            color: "white",
            width: "30%",
          }}
        />

        <button
          style={{
            padding: "10px 20px",
            textAlign: "center",
            backgroundColor: "black",
            color: "white",
          }}
        >
          Submit Token ID for Auction Listing
        </button>
      </form>
      <br></br>
      <br></br>
      <form onSubmit={SubmitAuctionListingOffer}>
        <input
          type="text"
          placeholder="enter AUCTION listing ID"
          onChange={AuctionListingListId}
          style={{
            padding: "10px 20px",
            textAlign: "center",
            border: "2px solid white",
            borderRadius: "4px",
            backgroundColor: "grey",
            color: "white",
            width: "30%",
          }}
        />
        <input
          type="text"
          placeholder="enter bid for AUCTION"
          onChange={AuctionListingListIdQuantity}
          style={{
            padding: "10px 20px",
            textAlign: "center",
            border: "2px solid white",
            borderRadius: "4px",
            backgroundColor: "grey",
            color: "white",
            width: "30%",
          }}
        />
        <button
          style={{
            padding: "10px 20px",
            textAlign: "center",
            backgroundColor: "black",
            color: "white",
          }}
        >
          Make a Bid
        </button>
      </form>

      <br></br>
    </div>
  );
};
export default AuctionComponent;
