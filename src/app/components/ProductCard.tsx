import React from "react";
import Image from "next/image";
import { Box, Button, Stack, Typography } from "@mui/material";
import { IProduct } from "./general.types";

import { deleteProduct } from "../store/productSlice";
import { useAppDispatch } from "../store";

import { formatNumber } from "../utils/index.utils";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface IProductCardProps {
  product: IProduct;
  handleEdit: () => void;
}

const ProductCard = ({ product, handleEdit }: IProductCardProps) => {
  const dispatch = useAppDispatch();

  const handleDelete = () => {
    dispatch(deleteProduct(product));
  };

  return (
    <>
      <Stack
        sx={{ flexDirection: { md: "row", xs: "col" } }}
        className="p-4 rounded-lg bg-white justify-between"
      >
        <Stack
          sx={{ flexDirection: { md: "row", xs: "col" } }}
          className="gap-4"
        >
          <Image
            className="rounded-md"
            src={"/product.png"}
            width={120}
            height={120}
            alt={`prd-img-${product.id}`}
          />
          <Box>
            <Typography className="text-xl font-bold">
              {product.title}
            </Typography>
            <Typography className="mt-1 text-lg">
              Rp. {formatNumber(product.price)}
            </Typography>
          </Box>
        </Stack>

        <Stack className="justify-between">
          <Typography className="text-right">
            Stock: <b>{product.stock}</b>
          </Typography>
          <Stack sx={{ flexDirection: "row" }} className="gap-3 items-end">
            <Button
              onClick={handleEdit}
              variant={"outlined"}
              startIcon={<EditIcon />}
            >
              Edit
            </Button>
            <Button
              onClick={handleDelete}
              variant={"outlined"}
              color="error"
              startIcon={<DeleteIcon />}
            >
              Delete
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
};

export default ProductCard;
