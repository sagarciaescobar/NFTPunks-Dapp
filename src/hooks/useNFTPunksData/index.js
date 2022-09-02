import { useWeb3React } from "@web3-react/core";
import { useCallback, useEffect, useState } from "react";
import { useNFTPunks } from "../useNFTPunks";

const getPunkData = async ({ nftPunks, tokenId }) => {
  const [
    tokenURI,
    dna,
    owner,
    accessoriesType,
    clotheColor,
    clotheType,
    eyeType,
    eyeBrowType,
    facialHairColor,
    facialHairType,
    hairColor,
    hatColor,
    graphicType,
    mouthType,
    skinColor,
    topType,
  ] = await Promise.all([
    nftPunks.methods.tokenURI(tokenId).call(),
    nftPunks.methods.tokenDNA(tokenId).call(),
    nftPunks.methods.ownerOf(tokenId).call(),
    nftPunks.methods.getAccessoriesType(tokenId).call(),
    nftPunks.methods.getAccessoriesType(tokenId).call(),
    nftPunks.methods.getClotheColor(tokenId).call(),
    nftPunks.methods.getClotheType(tokenId).call(),
    nftPunks.methods.getEyeType(tokenId).call(),
    nftPunks.methods.getEyeBrowType(tokenId).call(),
    nftPunks.methods.getFacialHairColor(tokenId).call(),
    nftPunks.methods.getFacialHairType(tokenId).call(),
    nftPunks.methods.getHairColor(tokenId).call(),
    nftPunks.methods.getHatColor(tokenId).call(),
    nftPunks.methods.getGraphicType(tokenId).call(),
    nftPunks.methods.getMouthType(tokenId).call(),
    nftPunks.methods.getSkinColor(tokenId).call(),
    nftPunks.methods.getTopType(tokenId).call(),
  ]);

  const responseMetadata = await fetch(tokenURI);
  let metadata = await (await responseMetadata.blob()).text();
  const regex = /name/i;
  const json = metadata.replace(regex, '"name"');
  const invalid = json.slice(21, 53);
  const opt = json.replace(invalid, "");
  metadata = JSON.parse(opt);

  return {
    tokenId,
    attributes: {
      accessoriesType,
      clotheColor,
      clotheType,
      eyeType,
      eyeBrowType,
      facialHairColor,
      facialHairType,
      hairColor,
      hatColor,
      graphicType,
      mouthType,
      skinColor,
      topType,
    },
    tokenURI,
    dna,
    owner,
    ...metadata,
  };
};

// Plural
const useNftPunksData = ({ owner = null } = {}) => {
  const [punks, setPunks] = useState([]);
  const { library } = useWeb3React();
  const [loading, setLoading] = useState(true);
  const nftPunks = useNFTPunks();

  const update = useCallback(async () => {
    if (nftPunks) {
      setLoading(true);

      let tokenIds;

      if (!library.utils.isAddress(owner)) {
        const totalSupply = await nftPunks.methods.totalSupply().call();
        tokenIds = new Array(Number(totalSupply))
          .fill()
          .map((_, index) => index);
      } else {
        const balanceOf = await nftPunks.methods.balanceOf(owner).call();
        const tokeIdOfOwner = new Array(Number(balanceOf))
          .fill()
          .map((_, i) => nftPunks.methods.tokenOfOwnerByIndex(owner, i).call());
        tokenIds = await Promise.all(tokeIdOfOwner);
      }

      const punksPromise = await tokenIds.map((tokenId) =>
        getPunkData({ nftPunks, tokenId })
      );

      const punk = await Promise.all(punksPromise);
      setPunks(punk);
      setLoading(false);
    }
  }, [nftPunks, owner, library?.utils]);

  useEffect(() => {
    update();
  }, [update]);

  return {
    loading,
    punks,
    update,
  };
};

// Singular
const useNftPunkData = (tokenId = null) => {
  const [punk, setPunk] = useState({});
  const [loading, setLoading] = useState(true);
  const nftPunks = useNFTPunks();

  const update = useCallback(async () => {
    if (nftPunks && tokenId != null) {
      setLoading(true);

      const toSet = await getPunkData({ tokenId, nftPunks });
      setPunk(toSet);

      setLoading(false);
    }
  }, [nftPunks, tokenId]);

  useEffect(() => {
    update();
  }, [update]);

  return {
    loading,
    punk,
    update,
  };
};

export { useNftPunksData, useNftPunkData };
