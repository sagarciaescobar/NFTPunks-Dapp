import {
  Stack,
  Heading,
  Text,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  Button,
  Tag,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { useWeb3React } from "@web3-react/core";
import RequestAccess from "../../components/request-access";
import PunkCard from "../../components/punk-card";
import { useNftPunkData } from "../../hooks/useNFTPunksData";
import { useParams } from "react-router-dom";
import Loading from "../../components/loading";
import { useNFTPunks } from "../../hooks/useNFTPunks";

const Punk = () => {
  const { active, account, library } = useWeb3React();
  const { tokenId } = useParams();
  const { loading, punk, update } = useNftPunkData(tokenId);
  const toast = useToast();
  const [, setTransfering] = useState(false);
  const nftPunks = useNFTPunks();

  const transfer = () => {
    setTransfering(true);
    const address = prompt("Ingresa la direccion de destino");
    const isAddress = library.utils.isAddress(address);
    console.log(punk.owner);
    console.log(account);
    console.log(address);
    console.log(punk);
    if (!isAddress) {
      toast({
        title: "Direccion invalida",
        description: "la direccion no es una direccion de etherum",
        status: "error",
      });
      setTransfering(false);
    } else {
      nftPunks.methods
        .safeTransferFrom(punk.owner, address, punk.tokenId)
        .send({ from: account })
        .on("error", () => {
          setTransfering(false);
          toast({
            title: "Direccion invalida",
            description: "la direccion no es una direccion de etherum",
            status: "error",
          });
        })
        .on("transactionHash", (txHash) => {
          toast({
            title: "Transaccion valida",
            description: txHash,
            status: "info",
          });
        })
        .on("receipt", () => {
          setTransfering("false");
          toast({
            title: "Transaccion confirmada",
            description: `El punk ahora pertenece a ${address}`,
            status: "success",
          });
          update();
        });
    }
  };

  if (!active) return <RequestAccess />;

  if (loading) return <Loading />;

  return (
    <Stack
      spacing={{ base: 8, md: 10 }}
      py={{ base: 5 }}
      direction={{ base: "column", md: "row" }}
    >
      <Stack>
        <PunkCard
          mx={{
            base: "auto",
            md: 0,
          }}
          tokenId={tokenId}
          name={punk.name}
          image={punk.image}
        />
        <Button
          disabled={account !== punk.owner}
          onClick={transfer}
          colorScheme="green"
        >
          {account !== punk.owner ? "No eres el dueño" : "Transferir"}
        </Button>
      </Stack>
      <Stack width="100%" spacing={5}>
        <Heading>{`${punk.name} ${tokenId}`}</Heading>
        <Text fontSize="xl">{punk.description}</Text>
        <Text fontWeight={600}>
          DNA:
          <Tag ml={2} colorScheme="green">
            {punk.dna}
          </Tag>
        </Text>
        <Text fontWeight={600}>
          Owner:
          <Tag ml={2} colorScheme="green">
            {punk.owner}
          </Tag>
        </Text>
        <Table size="sm" variant="simple">
          <Thead>
            <Tr>
              <Th>Atributo</Th>
              <Th>Valor</Th>
            </Tr>
          </Thead>
          <Tbody>
            {Object.entries(punk.attributes).map(([key, value]) => (
              <Tr key={key}>
                <Td>{key}</Td>
                <Td>
                  <Tag>{value}</Tag>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Stack>
    </Stack>
  );
};

export default Punk;
