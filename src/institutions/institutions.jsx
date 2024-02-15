import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Autocomplete,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function InstitutionsTable() {
  const [institutions, setInstitutions] = useState([]);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState(false);
  const [editingInstitution, setEditingInstitution] = useState(null);
  const [options, setOptions] = useState([]);
  const [nameError, setNameError] = useState("");
  const [codeError, setCodeError] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    fetchData(selectedOption);
  }, [selectedOption]);

  useEffect(() => {
    fetchOptions();
  }, [institutions]);

  const fetchData = async (selectedOption) => {
    try {
      let url = `${process.env.REACT_APP_API_URL}/institutions`;
      let response = null;
      if (selectedOption) {
        url = `${process.env.REACT_APP_API_URL}/institution/${selectedOption.id}`;
        response = await axios.get(url);
        const institutionsArray = [];
        institutionsArray.push(response.data)
        setInstitutions(institutionsArray);
      }else{
        response = await axios.get(url);
        setInstitutions(response.data);
      }
    } catch (error) {
      if (error.response.status === 404) {
        setInstitutions([]);
      } else {
        console.error("Error fetching data:", error);
      }
    }
  };

  const fetchOptions = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/institutions/active`
      );
      setOptions(response.data);
    } catch (error) {
      console.error("Error fetching options:", error);
    }
  };

  const handleCreate = async () => {
    setName("");
    setCode("");
    setStatus(false);
    setEditingInstitution({});
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/institution/delete/${id}`
      );
      fetchData();
    } catch (error) {
      console.error("Error deleting institution:", error);
    }
  };

  const handleEdit = (institution) => {
    setEditingInstitution(institution);
    setName(institution.name);
    setCode(institution.code);
    setStatus(institution.status);
  };

  const handleSaveEdit = async () => {
    const isNameValid = validateName();
    const isCodeValid = validateCode();
    if (!isNameValid || !isCodeValid) {
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/institution/create`, {
        id: editingInstitution.id,
        name,
        code,
        status: status,
      });
      setEditingInstitution(null);
      fetchData();
    } catch (error) {
      console.error("Error editing institution:", error);
    }
  };

  const handlePrint = () => {
    const table = document.getElementsByClassName("MuiTable-root")[0];
    const htmlContent = table.outerHTML;
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "grid.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleChange = (event) => {
    setStatus(event.target.value);
  };

  const validateName = () => {
    if (!name.trim()) {
      setNameError("Name is required");
      return false;
    }
    if (name.length  > 50) {
      setNameError("Name must be alphanumeric with up to 50 characters");
      return false;
    }
    setNameError("");
    return true;
  };

  const validateCode = () => {
    if (!code.trim()) {
      setCodeError("Code is required");
      return false;
    }
    if (code.length  > 5) {
      setCodeError("Code must be alphanumeric with up to 5 characters");
      return false;
    }
    setCodeError("");
    return true;
  };
  return (
    <Container className="my-4">
      <Row>
        <Col>
          <Grid container spacing={2}>
            <h2>Institutions</h2>
            <Grid item xs={12}>
              <Autocomplete
                className="mb-3"
                options={options || []}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search and select an Active Institution"
                  />
                )}
                onChange={(_, value) => setSelectedOption(value)}
              />
              <Button
                className="mb-3"
                variant="contained"
                color="primary"
                onClick={handleCreate}
              >
                Create
              </Button>
              <Button
                className="mb-3 float-end"
                variant="contained"
                color="primary"
                onClick={handlePrint}
              >
                Print
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Paper>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Code</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {institutions.map((institution) => (
                        <TableRow key={institution.id}>
                          <TableCell>{institution.id}</TableCell>
                          <TableCell>{institution.name}</TableCell>
                          <TableCell>{institution.code}</TableCell>
                          <TableCell>
                            {institution.status ? "True" : "False"}
                          </TableCell>
                          <TableCell>
                            <Button
                              className="me-2"
                              variant="contained"
                              color="primary"
                              onClick={() => handleEdit(institution)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="contained"
                              color="secondary"
                              onClick={() => handleDelete(institution.id)}
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
            {editingInstitution && (
              <Dialog
                open={!!editingInstitution}
                onClose={() => setEditingInstitution(null)}
              >
                <DialogTitle>
                  {" "}
                  {editingInstitution.id
                    ? "Edit Institution"
                    : "Create Institution"}
                </DialogTitle>
                <DialogContent>
                <TextField
                    fullWidth
                    required={true}
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mb-3 mt-3"
                    error={!!nameError}
                    helperText={nameError}
                  />
                  <TextField
                    required={true}
                    fullWidth
                    label="Code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="mb-3"
                    error={!!codeError}
                    helperText={codeError}
                  />
                  <FormControl fullWidth className="mb-3">
                    <InputLabel>Status</InputLabel>
                    <Select value={status} onChange={handleChange}>
                      <MenuItem value={true}>True</MenuItem>
                      <MenuItem value={false}>False</MenuItem>
                    </Select>
                  </FormControl>
                </DialogContent>
                <DialogActions>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSaveEdit}
                  >
                    {editingInstitution.id ? "Save" : "Create"}
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => setEditingInstitution(null)}
                  >
                    Cancel
                  </Button>
                </DialogActions>
              </Dialog>
            )}
          </Grid>
        </Col>
      </Row>
    </Container>
  );
}

export default InstitutionsTable;
