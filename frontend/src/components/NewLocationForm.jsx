import React, {useState, useContext} from 'react';
import {
    Box, Flex, Center,
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
    FormControl, FormHelperText, FormLabel,
    Input, NumberInput, NumberInputField, NumberDecrementStepper, NumberIncrementStepper, NumberInputStepper,
    Button, useDisclosure,
} from '@chakra-ui/react'
import Axios from '../axiosSetup';
import { UserContext } from '../context/userContext';

// Returns the form for creating a new station for free menstrual products and the button to open it
export default function NewLocationForm() {
    
    // Handles closing and opening of modal
    const { isOpen, onOpen, onClose } = useDisclosure();

    // Station form information
    const [name, setName] = useState('');
    const [pads, setPads] = useState(0);
    const [tampons, setTampons] = useState(0);
    const [other, setOther] = useState(0);
    const [lat, setLat] = useState(0);
    const [long, setLong] = useState(0);
    
    // Gets info of user and station list
    const {
        user, setUser, 
        loggedIn, setLoggedIn, 
        stationList, setStationList
    } =  useContext(UserContext);

    // Sends new location form info to database
    const handleFormSubmit = () => {
        Axios.post('/addNewStation', {
            name: name, 
            pads: pads, 
            tampons: tampons, 
            other: other,
            lat: lat,
            long: long,
        })
        .then(res => {
            // Resetting all the form inputs
            onClose();
            setName('');
            setPads(0);
            setTampons(0);
            setOther(0);
            setLat(0);
            setLong(0);
            setStationList([...stationList, res.data]);
        }).catch(err => console.log(err))
    }

    return (
        <Box>
            <Button onClick={onOpen}>Create</Button>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                <ModalHeader>Add New Period Product Station</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl>
                        {/* Location name section */}
                        <FormLabel>Location Name</FormLabel>
                        <FormHelperText>Location names must be unique.</FormHelperText>
                        <Input type='text' value={name} onChange={(e) => setName(e.target.value)} />
                        
                        {/* Location coordinates section */}
                        <Flex width='100%' justifyContent='space-between' marginTop='3px'>
                            <FormLabel>Latitude, Longitude</FormLabel>
                            <Center width='50%' justifyContent='end'>
                                <NumberInput max={90} min={-90} value={lat} onChange={(e) => setLat(e)} marginRight='4px'>
                                    <NumberInputField />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                                <NumberInput max={180} min={-180} value={long} onChange={(e) => setLong(e)}>
                                    <NumberInputField />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                            </Center>
                        </Flex>

                        {/* Pad quantity section */}
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

                        {/* Tampon quantity section */}
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

                        {/* Other menstrual products quantity section */}
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