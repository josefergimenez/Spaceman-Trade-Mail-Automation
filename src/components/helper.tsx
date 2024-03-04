

export const calculateColor = (percentage: number): string => {
  if (percentage <= 80) {
    return '#D65532'; 
  } else if (percentage > 80 && percentage <= 90) {
    return '#FFDE59';
  } else {
    return '#62BE7B';
  }
};


interface ArrowProps {
  pp: string;
}
const Arrow: React.FC<ArrowProps> = ({ pp }) => {
  const ppNum = parseFloat(pp)
  const color = ppNum === 0 ? '#CD6825' : ppNum > 0 ? 'green' : 'red';
  let transform = ''; 
  if (ppNum > 0) {
    transform = 'rotate(-90deg)'; 
    } else if (ppNum < 0) {
    transform = 'rotate(90deg)';   }
  return (
    <div><svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform }}>
      <path d="M5 12H19" stroke={color} strokeWidth="4" strokeLinecap="butt" strokeLinejoin="miter"/>
      <path d="M12 5L19 12L12 19" stroke={color} strokeWidth="4" strokeLinecap="butt" strokeLinejoin="miter"/>
    </svg></div>
  );
};

export { Arrow };

export const imageSrc= (id: number): string => {
    return '#D65532'; 
};



