import './index.css'

const CategoryTabs = props => {
  const {categories, selectedCategoryId, onChangeCategory} = props

  const onClickTab = id => {
    onChangeCategory(id)
  }

  return (
    <div className="tabs-container">
      {categories.map(each => (
        <button
          type="button"
          key={each.menu_category_id}
          className={`tab-item ${
            selectedCategoryId === each.menu_category_id ? 'active-tab' : ''
          }`}
          onClick={() => onClickTab(each.menu_category_id)}
        >
          {each.menu_category}
        </button>
      ))}
    </div>
  )
}

export default CategoryTabs
