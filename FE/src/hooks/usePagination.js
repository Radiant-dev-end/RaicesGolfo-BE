import { useState, useEffect, useMemo } from 'react';

/**
 * Hook para manejar paginación en el Frontend (Client-side)
 * @param {Function} fetchFunction - Función que retorna el ARRAY completo de datos
 * @param {number} itemsPerPage - Cantidad de elementos por página (LÍMITE CONFIGURABLE)
 */
const usePagination = (fetchFunction, itemsPerPage = 10) => {
    const [allItems, setAllItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetchFunction();
            // Aseguramos que tratamos con un array
            const dataArray = Array.isArray(response) ? response : (response.datos || []);
            setAllItems(dataArray);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Cálculo de datos para la página actual
    const { paginatedData, totalPaginas } = useMemo(() => {
        const total = allItems.length;
        const totalP = Math.ceil(total / itemsPerPage) || 1;
        
        // Ajustar página si el total de elementos cambia
        const currentPage = page > totalP ? totalP : page;
        
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        
        return {
            paginatedData: allItems.slice(start, end),
            totalPaginas: totalP
        };
    }, [allItems, page, itemsPerPage]);

    return {
        data: paginatedData,
        loading,
        error,
        page,
        setPage,
        totalPaginas,
        total: allItems.length,
        refresh: fetchData
    };
};

export default usePagination;
