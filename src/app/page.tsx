"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Menu,
  MenuItem,
  OutlinedInput,
  Stack,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

import ProductCard from "./components/ProductCard";

import { IProduct } from "./components/general.types";
import { useDebounce } from "./hooks/useDebounce";

import { useAppSelector } from "./store";
import ProductForm from "./components/ProductForm";

interface ISortData {
  target: "created_at" | "price" | "stock";
  type: "asc" | "desc";
}

interface ISortOptions {
  title: string;
  target: ISortData["target"];
}

const sortOptions: ISortOptions[] = [
  {
    title: "Date Created",
    target: "created_at",
  },
  {
    title: "Price",
    target: "price",
  },
  {
    title: "Stock",
    target: "stock",
  },
];

export default function Home() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const [modalOpen, setModalOpen] = useState<"" | "create" | "edit">("");
  const [selectedProduct, setSelectedProduct] = useState<IProduct>();

  const [filteredProduct, setFilteredProduct] = useState<IProduct[]>([]);
  const [sortData, setSortData] = useState<ISortData>({
    target: "created_at",
    type: "asc",
  });
  const [keyword, setKeyword] = useState<string>("");
  const debouncedKeyword = useDebounce(keyword, 500);

  const productList = useAppSelector((state) => state.product.product);

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    handleFilter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedKeyword, sortData, productList]);

  const handleEditCard = (product: IProduct) => {
    setSelectedProduct(product);
    setModalOpen("edit");
  };

  const handleCloseForm = () => {
    setModalOpen("");
    if (selectedProduct) setSelectedProduct(undefined);
  };

  const handleFilter = () => {
    const products = productList.filter((item) => {
      if (debouncedKeyword) {
        return item.title
          .toLowerCase()
          .includes(debouncedKeyword.toLowerCase());
      } else {
        return true;
      }
    });

    let sortedProducts: IProduct[] = products;
    if (sortData.target === "created_at") {
      sortedProducts = products.sort((a, b) =>
        sortData.type === "asc"
          ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          : new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } else if (sortData.target === "price") {
      sortedProducts = products.sort((a, b) =>
        sortData.type === "asc" ? a.price - b.price : b.price - a.price
      );
    } else if (sortData.target === "stock") {
      sortedProducts = products.sort((a, b) =>
        sortData.type === "asc" ? a.stock - b.stock : b.stock - a.stock
      );
    }

    setFilteredProduct(sortedProducts);
  };

  const handleSort = (target: ISortData["target"]) => {
    if (sortData.target === target) {
      setSortData({
        ...sortData,
        type: sortData.type === "asc" ? "desc" : "asc",
      });
    } else {
      setSortData({
        ...sortData,
        target,
      });
    }

    handleFilter();
    handleCloseMenu()
  };

  return (
    <>
      <Box className="p-6">
        <Stack className="w-100 gap-5 flex-col">
          <Stack
            sx={{ flexDirection: "row" }}
            className="items-center justify-between"
          >
            <Typography sx={{ fontWeight: 700, fontSize: "32px" }}>
              Product List
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setModalOpen("create")}
            >
              New Product
            </Button>
          </Stack>
          <Stack sx={{ flexDirection: "row" }} className="gap-2 items-center">
            {/* SEARCH BAR */}
            <OutlinedInput
              className="bg-white rounded-2xl w-full max-w-80"
              placeholder="Search product"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              size="small"
              startAdornment={<SearchIcon />}
            />

            {/* MENU */}
            <Button
              sx={{
                width: '100%',
                maxWidth: 'fit-content'
              }}
              id="basic-button"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              variant="outlined"
              onClick={handleOpenMenu}
              startIcon={
                sortData.type === "asc" ? (
                  <ArrowUpwardIcon />
                ) : (
                  <ArrowDownwardIcon />
                )
              }
            >
              {sortOptions.find((x) => x.target === sortData.target)?.title || 'Sort'}
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleCloseMenu}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              {sortOptions.map((opt, index) => (
                <MenuItem key={index} onClick={() => handleSort(opt.target)}>
                  {opt.title}
                </MenuItem>
              ))}
            </Menu>
          </Stack>
        </Stack>

        <Stack className="mt-5 gap-4">
          {filteredProduct.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              handleEdit={() => handleEditCard(item)}
            />
          ))}
        </Stack>

        {filteredProduct.length === 0 && <Box>No Product Found</Box>}
      </Box>

      {modalOpen !== "" && (
        <ProductForm
          open={true}
          modalType={modalOpen}
          handleClose={handleCloseForm}
          product={selectedProduct}
        />
      )}
    </>
  );
}
