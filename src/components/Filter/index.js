import React, { useState, useEffect, useCallback } from "react";
import { Container, Dropdown } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import './FilterOptions.css'; // Custom CSS file for additional styling
import FilterModal from "../FilterModal";

const FilterOptions = ({ filter, setFilter }) => {
    const [filterType, setFilterType] = useState("");
    const [filterOptions, setFilterOptions] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchFilterOptions = useCallback(async (type, url = "") => {
        setLoading(true);
        setError(null);
        setFilterType(type);
        let fetchUrl = "";

        switch (type) {
            case "homeworld":
                fetchUrl = url || "https://swapi.dev/api/planets/";
                break;
            case "film":
                fetchUrl = url || "https://swapi.dev/api/films/";
                break;
            case "species":
                fetchUrl = url || "https://swapi.dev/api/species/";
                break;
            default:
                fetchUrl = "";
                break;
        }

        if (fetchUrl) {
            try {
                const response = await fetch(fetchUrl);
                if (!response.ok) {
                    throw new Error(`Error fetching ${type} data: ${response.statusText}`);
                }
                const data = await response.json();
                setFilterOptions(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
    }, []);

    const handleFilterTypeChange = (type) => {
        setSelectedOption(null);
        if (type) {
            fetchFilterOptions(type);
        }
        setShowModal(true);
    };

    const handleOptionSelect = (option) => {
        if (filterType === "homeworld")
            setFilter(option.residents);
        else if (filterType === "film")
            setFilter(option.characters);
        else
            setFilter(option.people);

        setSelectedOption(filterType === "film" ? option.title : option.name);
        setShowModal(false);
    };
    const handlePageChange = (url) => {
        if (url) {
            fetchFilterOptions(filterType, url);
        }
    };
    useEffect(() => {
        if (!filter) {
            setFilterType("");
            setFilterOptions([]);
            setSelectedOption(null);
        }
    }, [filter]);

    return (
        <Container>
            <Dropdown onSelect={handleFilterTypeChange}>
                <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                    {filterType ? filterType.charAt(0).toUpperCase() + filterType.slice(1) : "Select Filter Type"}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item eventKey="homeworld">Homeworld</Dropdown.Item>
                    <Dropdown.Item eventKey="film">Film</Dropdown.Item>
                    <Dropdown.Item eventKey="species">Species</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>

            {selectedOption && (
                <p className="mt-2">
                    Selected {filterType}: <strong>{selectedOption}</strong>
                </p>
            )}
            <FilterModal
                showModal={showModal}
                setShowModal={setShowModal}
                filterOptions={filterOptions}
                filterType={filterType}
                loading={loading}
                error={error}
                setFilter={setFilter}
                setSelectedOption={handleOptionSelect}
                handlePageChange={handlePageChange}
            />
        </Container>
    );
};

export default FilterOptions;
