import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Pagination } from "../Pagination";

describe("Pagination", () => {
    it("calls onPageChange when clicking next", async () => {
        const user = userEvent.setup();
        const onPageChange = vi.fn();

        render(
            <Pagination
                currentPage={1}
                totalPages={3}
                totalItems={30}
                itemsPerPage={10}
                onPageChange={onPageChange}
            />
        );

        await user.click(screen.getByRole("button", { name: /next/i }));

        expect(onPageChange).toHaveBeenCalledWith(2);
    });
});