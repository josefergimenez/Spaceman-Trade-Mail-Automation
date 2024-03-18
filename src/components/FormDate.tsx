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
    startDate12: Date | null,
    startDate22: Date | null,
    endDate12: Date | null,
    endDate22: Date | null,
    setStartDate12: (date: Date | null)=> void,
    setEndDate12: (date: Date | null)=> void,
    setStartDate22: (date: Date | null)=> void,
    setEndDate22: (date: Date | null)=> void,
    setIsFormActive: (val: boolean) => void,
    textDate1: string,
    textDate2: string,
    textDate3: string,
    textDate4: string,
    setTextDate1: (date: string) => void,
    setTextDate2: (date: string) => void,
    setTextDate3: (date: string) => void,
    setTextDate4: (date: string) => void,

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
      startDate22,
      startDate12,
      endDate12,
      endDate22,
      setEndDate22,
      setStartDate22,
      setEndDate12,
      setStartDate12,
      setIsFormActive,
      textDate1,
      textDate2,
      textDate3,
      textDate4,
      setTextDate1,
      setTextDate2,
      setTextDate3,
      setTextDate4
    }) => {


  return (
    <form className="space-y-6 p-6">
      {/* Fecha 1 Range */}
      <div className="grid grid-cols-3 gap-4">
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
        <div>
          <label className="text-sm font-semibold text-gray-600 block mb-2">ETIQUETA:</label>
            <input
              type="text"
              value={textDate1}
              onChange={(e) => setTextDate1(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" 
            />
        </div>
      </div>

      {/* Fecha 2 Range */}
      <div className="grid grid-cols-3 gap-4">
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
        <div>
          <label className="text-sm font-semibold text-gray-600 block mb-2">ETIQUETA:</label>
            <input
              type="text"
              value={textDate2}
              onChange={(e) => setTextDate2(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" 
            />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-600 block mb-2">FECHA 1 (DESDE):</label>
          <DatePicker
            selected={startDate12}
            onChange={date => setStartDate12(date)}
            selectsStart
            startDate={startDate12}
            endDate={endDate12}
            maxDate={new Date()}
            dateFormat="dd/MM/yyyy"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-600 block mb-2">FECHA 1 (HASTA):</label>
          <DatePicker
            selected={endDate12}
            onChange={date => setEndDate12(date)}
            selectsEnd
            startDate={startDate12}
            endDate={endDate12}
            maxDate={new Date()}
            dateFormat="dd/MM/yyyy"
            minDate={startDate12}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <div>
            <label className="text-sm font-semibold text-gray-600 block mb-2">ETIQUETA: </label>
            <input
              type="text"
              value={textDate3}
              onChange={(e) => setTextDate3(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" 
            />
        </div>
      </div>

      {/* Fecha 2 Range */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-600 block mb-2">FECHA 2 (DESDE):</label>
          <DatePicker
            selected={startDate22}
            onChange={date => setStartDate22(date)}
            selectsStart
            startDate={startDate22}
            endDate={endDate22}
            maxDate={new Date()}
            dateFormat="dd/MM/yyyy"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-600 block mb-2">FECHA 2 (HASTA):</label>
          <DatePicker
            selected={endDate22}
            onChange={date => setEndDate22(date)}
            selectsEnd
            startDate={startDate22}
            endDate={endDate22}
            maxDate={new Date()}
            dateFormat="dd/MM/yyyy"
            minDate={startDate22}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <div>
        <label className="text-sm font-semibold text-gray-600 block mb-2">ETIQUETA: </label>
            <input
              type="text"
              value={textDate4}
              onChange={(e) => setTextDate4(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" 
            />
        </div>


      </div>
      {/* Submit Button */}
      <div className="flex justify-center">
        <button
          type="submit"
          className="py-2 px-4 text-white font-semibold rounded-lg shadow-md hover:bg-primary-700 focus:outline-none bg-primary"
          disabled={!startDate1 || !startDate2 || !endDate1 || !endDate2 || !startDate12 || !startDate22 || !endDate12 || !endDate22}
          onClick={()=>setIsFormActive(false)}
        >
          Generar
        </button>
      </div>
    </form>
  );
};

export default FormDate;


