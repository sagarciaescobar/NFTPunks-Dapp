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
const useNftPunksData = () => {
  const [punks, setPunks] = useState([]);
  const [loading, setLoading] = useState(true);
  const nftPunks = useNFTPunks();

  const update = useCallback(async () => {
    if (nftPunks) {
      setLoading(true);

      let tokenIds;

      const totalSupply = await nftPunks.methods.totalSupply().call();
      tokenIds = new Array(Number(totalSupply)).fill().map((_, index) => index);

      const punksPromise = await tokenIds.map((tokenId) =>
        getPunkData({ nftPunks, tokenId })
      );

      const punk = await Promise.all(punksPromise);
      console.log(punk);
      setPunks(punk);

      setLoading(false);
    }
  }, [nftPunks]);

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
// const usePlatziPunkData = () => {

// }

export { useNftPunksData };