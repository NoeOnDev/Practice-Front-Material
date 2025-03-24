import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Grid,
  Typography,
  Divider,
} from "@mui/material";
import PropTypes from "prop-types";

export const CustomFields = ({
  fields = [],
  values = {},
  onChange,
  readOnly = false,
  showTitle = true,
  spacing = 0,
  gridSize = { xs: 12, sm: 12 },
  containerProps = {},
}) => {
  const renderCustomField = (field) => {
    const fieldId = `custom_${field.id}`;
    const fieldValue = values[fieldId];

    switch (field.type) {
      case "text":
        return (
          <TextField
            key={field.id}
            fullWidth
            label={field.name}
            name={fieldId}
            value={fieldValue || ""}
            onChange={onChange}
            required={field.required}
            margin="normal"
            size="medium"
            disabled={readOnly}
          />
        );
      case "number":
        return (
          <TextField
            key={field.id}
            fullWidth
            type="number"
            label={field.name}
            name={fieldId}
            value={fieldValue || 0}
            onChange={onChange}
            required={field.required}
            margin="normal"
            size="medium"
            disabled={readOnly}
          />
        );
      case "select":
        return (
          <FormControl key={field.id} fullWidth margin="normal" size="medium">
            <InputLabel>{field.name}</InputLabel>
            <Select
              label={field.name}
              name={fieldId}
              value={fieldValue || ""}
              onChange={onChange}
              required={field.required}
              disabled={readOnly}
            >
              {readOnly ? (
                <MenuItem value={fieldValue}>{fieldValue}</MenuItem>
              ) : (
                field.options?.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
        );
      case "boolean":
        return (
          <FormControlLabel
            key={field.id}
            control={
              <Checkbox
                name={fieldId}
                checked={fieldValue === true || fieldValue === "true"}
                onChange={onChange}
                disabled={readOnly}
              />
            }
            label={field.name}
          />
        );
      default:
        return null;
    }
  };

  if (!fields || fields.length === 0) {
    return null;
  }

  return (
    <>
      {showTitle && (
        <>
          <Grid item xs={12}>
            <Divider sx={{ mt: 2, mb: 1 }} />
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
              {readOnly ? "Detalles de atención" : "Información de la atención"}
            </Typography>
          </Grid>
        </>
      )}

      <Grid container spacing={spacing} {...containerProps}>
        {fields.map((field) => (
          <Grid item {...gridSize} key={field.id}>
            {renderCustomField(field)}
          </Grid>
        ))}
      </Grid>
    </>
  );
};

CustomFields.propTypes = {
  fields: PropTypes.array,
  values: PropTypes.object,
  onChange: PropTypes.func,
  readOnly: PropTypes.bool,
  showTitle: PropTypes.bool,
  spacing: PropTypes.number,
  gridSize: PropTypes.object,
  containerProps: PropTypes.object,
};
