import * as React from "react";
import "./ContactTableStyles.css";
import { getRange } from "../../App";
import Icon from "@mdi/react";
import { mdiChevronLeft, mdiChevronRight } from "@mdi/js";

interface IContactTable {
  data: any[];
  selectedId: number | null;
  selectContact: React.Dispatch<any>;
}

const ContactTableComponent: React.FunctionComponent<IContactTable> = ({
  data,
  selectedId,
  selectContact,
}) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  const maxPage = React.useMemo(() => {
    return data.length / pageSize;
  }, [data, pageSize]);

  const innerRange = React.useMemo(() => {
    let options = getRange(currentPage - 2, currentPage + 2, maxPage);
    options = options.filter((option) => option >= 1 && option <= maxPage);
    // @ts-ignore
    if (options.includes(1) && options.length > 4) {
      const last = options[options.length - 1];
      options.push(last + 1);
    }
    // @ts-ignore
    if (options.includes(maxPage) && options.length > 4) {
      options.unshift(options[0] - 1);
    }
    return options;
  }, [currentPage, pageSize, maxPage]);

  const currentTableData = React.useMemo(() => {
    const firstPageIndex = (currentPage - 1) * pageSize;
    const lastPageIndex = firstPageIndex + pageSize;
    return data.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, pageSize, data]);

  const handlePageSizeChange = (e: any) => {
    setPageSize(e.target.value);
  };

  const handleDecreasePageCount = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleIncreasePageCount = () => {
    const maxPage = data.length / pageSize;
    if (currentPage < maxPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleSelectContact = (contact: any) => {
    selectContact(contact);
  };

  return (
    <>
      <table className="tableContainer">
        <thead>
          <tr>
            <th>ID</th>
            <th>FIRST NAME</th>
            <th>LAST NAME</th>
            <th>EMAIL</th>
            <th>PHONE #</th>
          </tr>
        </thead>
        <tbody>
          {currentTableData.map((item: any) => {
            return (
              <tr
                key={item.id}
                onClick={() => handleSelectContact(item)}
                className={`tableRow ${
                  item.id === selectedId ? "selectedRow" : ""
                }`}
              >
                <td>{item.id}</td>
                <td>{item.firstName}</td>
                <td>{item.lastName}</td>
                <td>{item.email}</td>
                <td>{item.phoneNumber}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="footer">
        <div className="paginationContainer">
          <div onClick={handleDecreasePageCount}>
            <Icon path={mdiChevronLeft} size={1.5} />
          </div>
          <p
            onClick={() => setCurrentPage(1)}
            style={{
              backgroundColor: currentPage === 1 ? "lightgrey" : "transparent",
            }}
          >
            1
          </p>
          {innerRange.map((page, i) => {
            if (page === 1 || page === maxPage) return null;

            if (currentPage >= 4 && i === 0) return <p key={i}>...</p>;
            if (maxPage - currentPage >= 4 && i === innerRange.length - 1)
              return <p key={i}>...</p>;
            return (
              <p
                key={i}
                onClick={() => setCurrentPage(page)}
                style={{
                  backgroundColor:
                    currentPage === page ? "lightgrey" : "transparent",
                }}
              >
                {page}
              </p>
            );
          })}
          {maxPage > 1 && (
            <p
              onClick={() => setCurrentPage(maxPage)}
              style={{
                backgroundColor:
                  currentPage === maxPage ? "lightgrey" : "transparent",
              }}
            >
              {maxPage}
            </p>
          )}

          <div onClick={handleIncreasePageCount}>
            <Icon path={mdiChevronRight} size={1.5} />
          </div>
        </div>
        <label className="pageSizeLabel">
          Page Size:
          <select value={pageSize} onChange={handlePageSizeChange}>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={500}>500</option>
          </select>
        </label>
      </div>
    </>
  );
};

export const ContactTable = ContactTableComponent;
