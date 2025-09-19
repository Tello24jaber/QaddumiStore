
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'

const SpecsTable = ({ product, attributes = [] }) => {
  const { t, i18n } = useTranslation()

  // Combine product specs with attribute values
  const getAllSpecs = () => {
    const specs = []

    // Basic product information
    if (product.brand_name || product.brands) {
      specs.push({
        key: 'brand',
        label: t('product.brand'),
        value: product.brand_name || (i18n.language === 'ar' ? product.brands?.name_ar : product.brands?.name_en)
      })
    }

    if (product.model_number) {
      specs.push({
        key: 'model',
        label: t('product.model'),
        value: product.model_number
      })
    }

    if (product.sku) {
      specs.push({
        key: 'sku',
        label: t('product.sku'),
        value: product.sku
      })
    }

    if (product.energy_rating) {
      specs.push({
        key: 'energy_rating',
        label: t('product.energyRating'),
        value: product.energy_rating
      })
    }

    if (product.warranty_months) {
      specs.push({
        key: 'warranty',
        label: t('product.warranty'),
        value: `${product.warranty_months} ${product.warranty_months === 1 ? 'شهر' : 'شهر'}`
      })
    }

    if (product.dimensions_cm) {
      specs.push({
        key: 'dimensions',
        label: t('product.dimensions'),
        value: `${product.dimensions_cm} سم`
      })
    }

    if (product.weight_kg) {
      specs.push({
        key: 'weight',
        label: t('product.weight'),
        value: `${product.weight_kg} كغ`
      })
    }

    // Add specs from product.specs JSONB field
    if (product.specs && typeof product.specs === 'object') {
      Object.entries(product.specs).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          specs.push({
            key: `spec_${key}`,
            label: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            value: value.toString()
          })
        }
      })
    }

    // Add attribute values
    if (attributes && attributes.length > 0) {
      attributes.forEach(attr => {
        const attrName = i18n.language === 'ar' ? attr.name_ar : attr.name_en
        const unit = i18n.language === 'ar' ? attr.unit_ar : attr.unit_en
        
        let value = attr.value_text || attr.value_number || (attr.value_boolean ? 'نعم' : 'لا')
        if (unit) {
          value = `${value} ${unit}`
        }

        specs.push({
          key: `attr_${attr.id}`,
          label: attrName,
          value
        })
      })
    }

    return specs
  }

  const specs = getAllSpecs()

  if (specs.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {t('product.noSpecifications')}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <tbody>
          {specs.map((spec, index) => (
            <tr key={spec.key} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
              <td className="py-3 px-4 text-sm font-medium text-gray-900 border-b border-gray-200 w-1/3">
                {spec.label}
              </td>
              <td className="py-3 px-4 text-sm text-gray-700 border-b border-gray-200">
                {spec.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

SpecsTable.propTypes = {
  product: PropTypes.shape({
    sku: PropTypes.string,
    model_number: PropTypes.string,
    energy_rating: PropTypes.string,
    warranty_months: PropTypes.number,
    dimensions_cm: PropTypes.string,
    weight_kg: PropTypes.number,
    brand_name: PropTypes.string,
    brands: PropTypes.shape({
      name_ar: PropTypes.string,
      name_en: PropTypes.string,
    }),
    specs: PropTypes.object,
  }).isRequired,
  attributes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name_ar: PropTypes.string.isRequired,
      name_en: PropTypes.string.isRequired,
      unit_ar: PropTypes.string,
      unit_en: PropTypes.string,
      value_text: PropTypes.string,
      value_number: PropTypes.number,
      value_boolean: PropTypes.bool,
    })
  ),
}

export default SpecsTable