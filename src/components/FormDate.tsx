import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

type Props = {
    startDate1: Date | null,
    startDate2: Date | null,
    endDate1: Date | null,
    endDate2: Date | null,
    setStartDate1: (date: Date | null)=> void,
    setEndDate1: (date: Date | null)=> void,
    setStartDate2: (date: Date | null)=> void,
    setEndDate2: (date: Date | null)=> void,
    setIsFormActive: (val: boolean) => void 
}

const FormDate: React.FC<Props> = (
    {
      startDate2,
      startDate1,
      endDate1,
      endDate2,
      setEndDate2,
      setStartDate2,
      setEndDate1,
      setStartDate1,
      setIsFormActive
    }) => {


  return (
    <form className="space-y-6 p-6">
      {/* Fecha 1 Range */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-600 block mb-2">FECHA 1 (DESDE):</label>
          <DatePicker
            selected={startDate1}
            onChange={date => setStartDate1(date)}
            selectsStart
            startDate={startDate1}
            endDate={endDate1}
            maxDate={new Date()}
            dateFormat="dd/MM/yyyy"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-600 block mb-2">FECHA 1 (HASTA):</label>
          <DatePicker
            selected={endDate1}
            onChange={date => setEndDate1(date)}
            selectsEnd
            startDate={startDate1}
            endDate={endDate1}
            maxDate={new Date()}
            dateFormat="dd/MM/yyyy"
            minDate={startDate1}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      {/* Fecha 2 Range */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-600 block mb-2">FECHA 2 (DESDE):</label>
          <DatePicker
            selected={startDate2}
            onChange={date => setStartDate2(date)}
            selectsStart
            startDate={startDate2}
            endDate={endDate2}
            maxDate={new Date()}
            dateFormat="dd/MM/yyyy"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-600 block mb-2">FECHA 2 (HASTA):</label>
          <DatePicker
            selected={endDate2}
            onChange={date => setEndDate2(date)}
            selectsEnd
            startDate={startDate2}
            endDate={endDate2}
            maxDate={new Date()}
            dateFormat="dd/MM/yyyy"
            minDate={startDate2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-center">
        <button
          type="submit"
          className="py-2 px-4 text-white font-semibold rounded-lg shadow-md hover:bg-primary-700 focus:outline-none bg-primary"
          disabled={!startDate1 || !startDate2 || !endDate1 || !endDate2}
          onClick={()=>setIsFormActive(false)}
        >
          Generar
        </button>
      </div>
    </form>
  );
};

export default FormDate;


