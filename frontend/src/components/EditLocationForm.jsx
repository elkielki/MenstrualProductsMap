import React, { useState, useContext } from 'react';
import {    
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
    FormControl, FormHelperText, FormLabel,
    Input, NumberInput, NumberInputField, NumberDecrementStepper, NumberIncrementStepper, NumberInputStepper,
    Box, Center, Flex,
    Button, IconButton, useDisclosure
} from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import Axios from '../axiosSetup';
import { UserContext } from '../context/userContext';

/* 
    Props:
        station - the station that is being edited
        idx - the index of the station in the station list
    Returns the edit button and a form for the user to edit menstrual product quantities for a specific location
*/
export default function EditLocationForm({station, idx}) {
    // Handles opening and closing of modals
    const { isOpen, onOpen, onClose } = useDisclosure();

    // The quantity of pads, tampons, and other menstrual products at this location
    const [pads, setPads] = useState(station.padQuantity);
    const [tampons, setTampons] = useState(station.tamponQuantity);
    const [other, setOther] = useState(station.otherQuantity);

    const {
        user, setUser, 
        loggedIn, setLoggedIn, 
        stationList, setStationList
    } =  useContext(UserContext);

    // Updates the menstrual product quantities in the database
    const handleFormSubmit = () => {
        Axios.put('/editStation', {
            name: station.name,
            pads: pads, 
            tampons: tampons, 
            other: other,
        })
        .then(res => {
            // Close edit form
            onClose();
            // Update station list shown on front page
            setStationList((prevList) => 
                prevList.map(stat => {
                    if (stat.name == station.name) {
                        return res.data;
                    } else {
                        return stat;
                    }
                }
            ))
            // Update menstrual product quantities shown in station list
            setPads(res.data.padQuantity);
            setTampons(res.data.tamponQuantity);
            setOther(res.data.otherQuantity);
        }).catch(err => console.log(err))
    }

    return (
        <Box>
            {/* Edit button to open modal */}
            <IconButton icon={<EditIcon />} onClick={onOpen} />
            
            {/* Modal containing edit form */}
            <Modal isOpen={isOpen} onClose={onClose} >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Edit Period Product Station</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody >
                        <FormControl>
                            <FormHelperText>Location names and coordinates cannot be edited.<br/>The max quantity for each product is 1000.</FormHelperText>
                            <FormLabel>Location Name</FormLabel>
                            <Input type='text' value={station.name} disabled />
                            
                            {/* Coordinate Input Section */}
                            <Flex width='100%' justifyContent='space-between' marginTop='3px'>
                                <FormLabel>Latitude, Longitude</FormLabel>
                                <Center width='50%' justifyContent='end'>
                                    <NumberInput max={90} min={-90} value={station.location.coordinates[1]} disabled marginRight='4px'>
                                        <NumberInputField />
                                        <NumberInputStepper>
                                            <NumberIncrementStepper />
                                            <NumberDecrementStepper />
                                        </NumberInputStepper>
                                    </NumberInput>
                                    <NumberInput max={180} min={-180} value={station.location.coordinates[0]} disabled >
                                        <NumberInputField />
                                        <NumberInputStepper>
                                            <NumberIncrementStepper />
                                            <NumberDecrementStepper />
                                        </NumberInputStepper>
                                    </NumberInput>
                                </Center>
                            </Flex>

                            {/* Pad Quantity Input Section */}
                            <Flex width='100%' justifyContent='space-between' marginTop='3px'>
                                <FormLabel>Pad Quantity</FormLabel>
                                <NumberInput max={1000} min={0} value={pads} onChange={(e) => setPads(e)} width='25%'>
                                    <NumberInputField />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                            </Flex>

                            {/* Tampon Quantity Input Section */}
                            <Flex width='100%' justifyContent='space-between' marginTop='3px'>
                                <FormLabel>Tampon Quantity</FormLabel>
                                <NumberInput max={1000} min={0} value={tampons} onChange={(e) => setTampons(e)} width='25%'>
                                    <NumberInputField />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                            </Flex>

                            {/* Other Menstrual Product Input Section */}
                            <Flex width='100%' justifyContent='space-between' marginTop='3px'>
                                <FormLabel>Other Quantity</FormLabel>
                                <NumberInput max={1000} min={0} value={other} onChange={(e) => setOther(e)} width='25%'>
                                    <NumberInputField />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                            </Flex>
                        </FormControl>
                    </ModalBody>
                    
                    {/* Submit button */}
                    <ModalFooter>
                        <Button onClick={handleFormSubmit} variant='ghost'>Submit</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    )
}