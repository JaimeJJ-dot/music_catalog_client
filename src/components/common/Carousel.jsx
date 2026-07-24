// src/components/common/Carousel.jsx
import { useRef } from 'react';
import { Box, IconButton } from '@mui/material';
import { ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from '@mui/icons-material';
import './Carousel.css';

const Carousel = ({ children }) => {
  const scrollRef = useRef(null);

  const scrollByAmount = (direction) => {
    if (scrollRef.current) {
      const amount = direction === 'left' ? -440 : 440;
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <Box className="carousel-wrapper">
      <IconButton
        className="carousel-arrow carousel-arrow-left"
        onClick={() => scrollByAmount('left')}
        aria-label="Anterior"
      >
        <ChevronLeftIcon />
      </IconButton>

      <Box className="carousel-track" ref={scrollRef}>
        {children}
      </Box>

      <IconButton
        className="carousel-arrow carousel-arrow-right"
        onClick={() => scrollByAmount('right')}
        aria-label="Siguiente"
      >
        <ChevronRightIcon />
      </IconButton>
    </Box>
  );
};

export default Carousel;