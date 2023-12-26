import { useEffect } from "react";
import { useSnackbar } from "notistack";
import { styled } from "@mui/material/styles";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Checkbox } from "@mui/material";
import { Dialog, DialogTitle } from "components/Dialog";
import Button from "components/Button";
import Spinner from "components/Spinner";
import { useMergeState } from "utils/custom-hooks";
import { listPlans } from "api";

const StyledTableCell = styled(TableCell)(() => ({
  padding: 0,
}));

export default function EnrollMemberDialog({
  open,
  onClose,
  onSave,
  location,
}) {
  const { enqueueSnackbar } = useSnackbar();

  const [state, setState] = useMergeState({
    plans: [],
    selectedPlanId: null,
  });

  const handleSelectPlan = (selectedPlanId) => {
    setState({ selectedPlanId });
  };

  const handleSave = () => {
    onSave(state?.selectedPlanId);
  };

  const init = async () => {
    try {
      setState({ isLoading: true });

      const response = await listPlans({ location });

      setState({ plans: response?.data });
    } catch (error) {
      enqueueSnackbar(error?.message, { variant: "error" });
    } finally {
      setState({ isLoading: false });
    }
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <Dialog
      onClose={(event, reason) => {
        if (reason !== "backdropClick") {
          onClose();
        }
      }}
      disableEscapeKeyDown
      open={open}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle onClose={onClose}>Enroll Member</DialogTitle>

      <DialogContent dividers>
        {state?.isLoading ? (
          <Spinner loading={state?.isLoading} />
        ) : (
          <div>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell />
                  </TableRow>
                </TableHead>
                <TableBody style={{ overflow: "visible" }}>
                  {state?.plans?.map((plan) => (
                    <TableRow key={plan._id}>
                      <StyledTableCell component="th" scope="row">
                        <Checkbox
                          color="secondary"
                          checked={plan?._id === state?.selectedPlanId}
                          onChange={() => handleSelectPlan(plan._id)}
                        />

                        <span className="text-grey">{plan?.name}</span>
                      </StyledTableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        )}
      </DialogContent>

      <DialogActions>
        <div className="my-2">
          <Button
            label="Enroll"
            color="info"
            onClick={handleSave}
            style={{
              borderRadius: 4,
              fontSize: 14,
              color: "#FFFFFF",
              height: 40,
              width: 150,
            }}
          />
        </div>
      </DialogActions>
    </Dialog>
  );
}
