
import React from 'react';
import ReactDOM from 'react-dom';
import YoutubeModal from 'react-youtube-modal';



import {
	ReactiveBase,
	DataSearch,
	MultiList,
	SelectedFilters,
	ReactiveList,
	ResultCard,
    ToggleButton,
	SingleList
} from '@appbaseio/reactivesearch';
import {
	Row,
	Button,
	Col,
	Card,
	Switch,
	Tree,
	Popover,
	Affix
} from 'antd';
import 'antd/dist/antd.css';


import ExpandCollapse from 'react-expand-collapse';

import './styles.css';

const { TreeNode } = Tree;

const renderAsTree = (res, key = '0') => {
	if (!res) return null;
	const iterable = Array.isArray(res) ? res : Object.keys(res);
	return iterable.map((item, index) => {
		const type = typeof res[item];
		if (type === 'string' || type === 'number') {
			return (
				<TreeNode
					title={
						<div>
							<span>{item}:</span>&nbsp;
							<span dangerouslySetInnerHTML={{ __html: res[item] }} />
						</div>
					}
					key={key + "-" + (index + 1)}
				/>
			);
		}
		const hasObject = (res[item] === undefined && typeof item !== 'string');
		const node = hasObject ? item : res[item];
		return (
			<TreeNode
				title={typeof item !== 'string' ? 'Object' : '' + (node || Array.isArray(res) ? item : item + ': null')}
				key={key + "-" + (index + 1)}
			>
				{renderAsTree(node, key + "-" + (index + 1))}
			</TreeNode>
		);
	});
};

function renderItem(res, triggerClickAnalytics) {
	return (
		<div onClick={triggerClickAnalytics} className="list-item" key={res._id}>
			<ExpandCollapse
				previewHeight="390px"
				expandText="Show more"
			>
				{
					<Tree showLine>
						{renderAsTree(res)}
					</Tree>
				}
			</ExpandCollapse>
		</div>
	);
};

const App = () => (
	<ReactiveBase
		app="y1"
		url="http://163.123.181.211:9200"
		analytics={false}
		searchStateHeader
	>
		<Row gutter={16} style={{ padding: 20 }}>
			<Col span={6}>
				<Card>
				<ToggleButton
					componentId="Status"
					dataField="Privacy_Status.keyword"
					data={[
						{ label: 'Private', value: 'private' },
						{ label: 'Public', value: 'public' }
					]}
				/>
				<MultiList
				  componentId="list-1"
				  dataField="Playlist_Name.keyword"
				  size={100}
				  style={{
				    marginBottom: 20
				  }}
				  title="Album"
				/>
				<SingleList
				  componentId="CitySensor"
				  dataField="Playlist_Name.keyword"
				  title="Cities"
				  size={100}
				  sortBy="count"
				 
				  showRadio={true}
				  showCount={true}
				  showSearch={true}
				  placeholder="Search City"
				 
				  showFilter={true}
				  filterLabel="City"
				
				  loader="Loading ..."
				/>
				</Card>
			</Col>
			<Col span={18}>
				<DataSearch
				  componentId="search"
				  dataField={[
				    'Video_Title',
				    'Video_Title.autosuggest',
				    'Video_Title.keyword'
				  ]}
				  fieldWeights={[
				    1,
				    1,
				    1
				  ]}
				  fuzziness={0}
				  highlightField={[
				    'Video_Title'
				  ]}
				  style={{
				    marginBottom: 20
				  }}
				/>

				<SelectedFilters />
				<div id="result">
					<ReactiveList
				  componentId="result"
				  dataField="_score"
				  pagination={true}
				  react={{
				    and: [
				      'search',
				      'list-1',
					  'Status',
					  'CitySensor'
				    ]
				  }}
				  renderItem={renderItem}
				  size={10}
				  style={{
				    marginTop: 20
				  }}
				  render={({ data }) => (
						<ReactiveList.ResultCardsWrapper>
							{data.map(item => (
						    <YoutubeModal videoId={item.Video_Id} height="529" width="920" >
								<ResultCard className="js-video-button" key={item.id}  >
								 
									
								   
									<ResultCard.Image src={item.image}/>
										<ResultCard.Title>
										<div
											className="book-title"
											dangerouslySetInnerHTML={{
												__html: item.Video_Title,
											}}
										/>
									</ResultCard.Title>
									

									<ResultCard.Description>
										<div className="flex column justify-space-between">
											<div>
												<div>
													by{' '}
													<span className="authors-list">
														{item.Playlist_Name}
													</span>
												</div>
												<div className="ratings-list flex align-center">
													<span className="stars">
														{Array(item.average_rating_rounded)
															.fill('x')
															.map((
																item, // eslint-disable-line
																index,
															) => (
																<i
																	className="fas fa-star"
																	key={index} // eslint-disable-line
																/>
															))}
													</span>
													<span className="avg-rating">
														({item.average_rating} avg)
													</span>
												</div>
											</div>
											<span className="pub-year">
												Pub {item.original_publication_year}
											</span>
										</div>
									</ResultCard.Description>
								</ResultCard>
								</YoutubeModal>
							))}
						</ReactiveList.ResultCardsWrapper>
					)}
				/>
				</div>
			</Col>
			
		</Row>
	</ReactiveBase>
);

ReactDOM.render(
	<App />,
	document.getElementById('root')
);
