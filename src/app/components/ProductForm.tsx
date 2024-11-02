import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import React from "react";
import { IProduct } from "./general.types";
import { number, object, string } from "yup";
import { useFormik } from "formik";

import { addProduct, editProduct } from "../store/productSlice";
import { useAppDispatch } from "../store";

interface IProductFormProps {
  open: boolean;
  handleClose: () => void;
  modalType: "" | "create" | "edit";
  product?: IProduct;
}

const requiredMsg = "This field is required.";
const ProductForm = ({
  open,
  handleClose,
  modalType,
  product,
}: IProductFormProps) => {
  const dispatch = useAppDispatch()
  const productSchema = object({
    title: string().required(requiredMsg),
    price: number().min(0).required(requiredMsg),
    stock: number().min(0).required(requiredMsg),
  });

  const formik = useFormik({
    initialValues: {
      title: product?.title || "",
      price: product?.price || 0,
      stock: product?.stock || 0,
    },
    validationSchema: productSchema,
    onSubmit: (values) => {
      const currentDate = new Date()

      const productData: IProduct = {
        id: product?.id || currentDate.getTime(),
        created_at: product?.created_at || currentDate,
        ...values
      }

      if (modalType === 'create') {
        dispatch(addProduct(productData))
      } else {
        dispatch(editProduct(productData))
      }
      handleClose()
    },
  });

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth={'sm'}
      PaperProps={{
        component: "form",
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          formik.handleSubmit();
        },
      }}
    >
      <DialogTitle>Product Form</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please fill this form to {modalType === "create" ? "Create" : "Edit"}{" "}
          product.
        </DialogContentText>
        <Stack className="mt-5 gap-4">
          <TextField
            autoFocus
            variant="outlined"
            margin="dense"
            id="title"
            name="title"
            label="Title"
            fullWidth
            value={formik.values.title}
            onChange={formik.handleChange}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
          />
          <TextField
            variant="outlined"
            margin="dense"
            id="price"
            name="price"
            label="Price"
            fullWidth
            type="number"
            value={formik.values.price}
            onChange={formik.handleChange}
            error={formik.touched.price && Boolean(formik.errors.price)}
            helperText={formik.touched.price && formik.errors.price}
          />
          <TextField
            variant="outlined"
            margin="dense"
            id="stock"
            name="stock"
            label="Stock"
            fullWidth
            type="number"
            value={formik.values.stock}
            onChange={formik.handleChange}
            error={formik.touched.stock && Boolean(formik.errors.stock)}
            helperText={formik.touched.stock && formik.errors.stock}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button type="submit">
          {modalType === "create" ? "Create" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductForm;
